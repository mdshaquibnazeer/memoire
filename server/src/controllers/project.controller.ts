import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { generateSlug } from '../utils/slug';
import { DEMO_PROJECTS } from '../utils/demos';

// ============================================
// LIST USER PROJECTS
// ============================================

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { page = '1', limit = '10', status } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { userId };
    if (status) where.status = status;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          theme: true,
          status: true,
          coverImageUrl: true,
          personOneName: true,
          personTwoName: true,
          occasion: true,
          viewCount: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { memories: true, galleryItems: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { allowedDemoPreviews: true }
    });
    const allowedDemos = user?.allowedDemoPreviews || ['ROMANTIC_GLOW', 'CINEMATIC_MEMORIES', 'AURORA_DREAMS', 'CELESTIAL_BIRTHDAY'];
    
    // Fetch live system showcases from database
    const dbDemos = await prisma.project.findMany({
      where: {
        userId: 'system-demo',
        theme: { in: allowedDemos as any }
      },
      include: {
        _count: {
          select: { memories: true, galleryItems: true }
        }
      }
    });

    const activeDemos = dbDemos.length > 0 ? dbDemos : DEMO_PROJECTS.filter(d => allowedDemos.includes(d.theme));

    const pageNum = parseInt(page as string);
    let allProjects = [...projects];
    if (pageNum === 1) {
      const safeDemos = activeDemos.map(d => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        subtitle: d.subtitle,
        theme: d.theme as any,
        status: d.status as any,
        coverImageUrl: d.coverImageUrl,
        personOneName: d.personOneName,
        personTwoName: d.personTwoName,
        occasion: d.occasion,
        viewCount: d.viewCount,
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
        _count: d._count
      }));
      allProjects = [...safeDemos, ...allProjects];
    }

    res.json({
      projects: allProjects,
      pagination: {
        page: pageNum,
        limit: parseInt(limit as string),
        total: total + activeDemos.length,
        pages: Math.ceil((total + activeDemos.length) / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET SINGLE PROJECT (FOR EDITING)
// ============================================

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (id.startsWith('demo-')) {
      const demo = await prisma.project.findFirst({
        where: { id },
        include: {
          memories: { orderBy: { date: 'asc' } },
          galleryItems: { orderBy: { sortOrder: 'asc' } },
          _count: { select: { memories: true, galleryItems: true } }
        }
      });
      if (demo) {
        return res.json({ project: demo });
      }
    }

    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        memories: {
          orderBy: { date: 'asc' },
        },
        galleryItems: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CREATE PROJECT
// ============================================

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const {
      title,
      subtitle,
      theme,
      personOneName,
      personTwoName,
      occasion,
      startDate,
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account is suspended.' });
    }

    // Check project limit
    const activeProjectsCount = await prisma.project.count({ where: { userId } });
    const limits = (user.userLimits as any) || { maxProjects: 3, maxMemoriesPerProject: 10, maxGalleryItemsPerProject: 20 };
    if (activeProjectsCount >= limits.maxProjects && user.role !== 'ADMIN') {
      return res.status(400).json({ error: `You have reached the maximum allowed limit of ${limits.maxProjects} projects. Contact admin to upgrade.` });
    }

    // Check theme permission
    const requestedTheme = theme || 'ROMANTIC_GLOW';
    const isThemeAllowed = user.allowedTemplates.includes(requestedTheme);
    if (!isThemeAllowed && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You are not authorized to use this theme. Contact admin.' });
    }

    // Check theme expiration
    const expirations = (user.themeExpirations as any) || {};
    const expiry = expirations[requestedTheme];
    if (expiry && new Date(expiry) < new Date() && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Your authorization for this theme has expired. Contact admin to renew.' });
    }

    const slug = await generateSlug(title, userId);

    const project = await prisma.project.create({
      data: {
        userId,
        slug,
        title,
        subtitle,
        theme: theme || 'ROMANTIC_GLOW',
        personOneName,
        personTwoName,
        occasion,
        startDate: startDate ? new Date(startDate) : undefined,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE PROJECT
// ============================================

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const userRole = (req as any).userRole;
    if (id.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects are read-only.' });
    }

    // Verify ownership
    const existing = await prisma.project.findFirst({ where: { id, userId: id.startsWith('demo-') ? 'system-demo' : userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const {
      title, subtitle, theme, personOneName, personTwoName,
      occasion, startDate, coverImageUrl, backgroundMusicUrl,
      heroConfig, endingConfig, seoTitle, seoDescription,
      isPasswordProtected, accessPassword,
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account is suspended.' });
    }

    if (theme && theme !== existing.theme && user.role !== 'ADMIN') {
      // Check theme permission
      const isThemeAllowed = user.allowedTemplates.includes(theme);
      if (!isThemeAllowed) {
        return res.status(403).json({ error: 'You are not authorized to use this theme. Contact admin.' });
      }

      // Check theme expiration
      const expirations = (user.themeExpirations as any) || {};
      const expiry = expirations[theme];
      if (expiry && new Date(expiry) < new Date()) {
        return res.status(403).json({ error: 'Your authorization for this theme has expired. Contact admin to renew.' });
      }
    }

    const mergedHeroConfig = heroConfig !== undefined ? {
      ...((existing.heroConfig as any) || {}),
      ...heroConfig,
    } : undefined;

    const mergedEndingConfig = endingConfig !== undefined ? {
      ...((existing.endingConfig as any) || {}),
      ...endingConfig,
    } : undefined;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(theme && { theme }),
        ...(personOneName !== undefined && { personOneName }),
        ...(personTwoName !== undefined && { personTwoName }),
        ...(occasion !== undefined && { occasion }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(backgroundMusicUrl !== undefined && { backgroundMusicUrl }),
        ...(mergedHeroConfig !== undefined && { heroConfig: mergedHeroConfig }),
        ...(mergedEndingConfig !== undefined && { endingConfig: mergedEndingConfig }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(isPasswordProtected !== undefined && { isPasswordProtected }),
        ...(accessPassword !== undefined && { accessPassword }),
      },
      include: {
        memories: { orderBy: { date: 'asc' } },
        galleryItems: { orderBy: { sortOrder: 'asc' } },
      },
    });

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PUBLISH PROJECT
// ============================================

export const publishProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { scheduledFor } = req.body;

    const existing = await prisma.project.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const project = await prisma.project.update({
      where: { id },
      data: {
        status: scheduledFor ? 'SCHEDULED' : 'PUBLISHED',
        publishedAt: scheduledFor ? null : new Date(),
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      },
    });

    res.json({ project, message: scheduledFor ? 'Project scheduled!' : 'Project published!' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE PROJECT
// ============================================

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const userRole = (req as any).userRole;
    if (id.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects cannot be deleted.' });
    }

    const existing = await prisma.project.findFirst({ where: { id, userId: id.startsWith('demo-') ? 'system-demo' : userId } });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// MEMORY CRUD
// ============================================

export const addMemory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { projectId } = req.params;

    const userRole = (req as any).userRole;
    if (projectId.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects are read-only.' });
    }

    const project = await prisma.project.findFirst({ where: { id: projectId, userId: projectId.startsWith('demo-') ? 'system-demo' : userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account is suspended.' });
    }

    const limits = (user.userLimits as any) || { maxProjects: 3, maxMemoriesPerProject: 10, maxGalleryItemsPerProject: 20 };
    const memoryCount = await prisma.memory.count({ where: { projectId } });
    if (memoryCount >= limits.maxMemoriesPerProject && user.role !== 'ADMIN') {
      return res.status(400).json({ error: `You have reached the maximum allowed limit of ${limits.maxMemoriesPerProject} memories per project.` });
    }

    const { title, description, date, imageUrl, videoUrl, location, emoji, sortOrder } = req.body;

    const memory = await prisma.memory.create({
      data: {
        projectId,
        title,
        description,
        date: new Date(date),
        imageUrl,
        videoUrl,
        location,
        emoji,
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json({ memory });
  } catch (error) {
    next(error);
  }
};

export const updateMemory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { projectId, memoryId } = req.params;

    const userRole = (req as any).userRole;
    if (projectId.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects are read-only.' });
    }

    const project = await prisma.project.findFirst({ where: { id: projectId, userId: projectId.startsWith('demo-') ? 'system-demo' : userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const memory = await prisma.memory.update({
      where: { id: memoryId },
      data: req.body,
    });

    res.json({ memory });
  } catch (error) {
    next(error);
  }
};

export const deleteMemory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { projectId, memoryId } = req.params;

    const userRole = (req as any).userRole;
    if (projectId.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects are read-only.' });
    }

    const project = await prisma.project.findFirst({ where: { id: projectId, userId: projectId.startsWith('demo-') ? 'system-demo' : userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await prisma.memory.delete({ where: { id: memoryId } });

    res.json({ message: 'Memory deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GALLERY CRUD
// ============================================

export const addGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { projectId } = req.params;

    const userRole = (req as any).userRole;
    if (projectId.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects are read-only.' });
    }

    const project = await prisma.project.findFirst({ where: { id: projectId, userId: projectId.startsWith('demo-') ? 'system-demo' : userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account is suspended.' });
    }

    const limits = (user.userLimits as any) || { maxProjects: 3, maxMemoriesPerProject: 10, maxGalleryItemsPerProject: 20 };
    const galleryCount = await prisma.galleryItem.count({ where: { projectId } });
    if (galleryCount >= limits.maxGalleryItemsPerProject && user.role !== 'ADMIN') {
      return res.status(400).json({ error: `You have reached the maximum allowed limit of ${limits.maxGalleryItemsPerProject} gallery items per project.` });
    }

    const { mediaUrl, mediaType, caption, altText, width, height, sortOrder } = req.body;

    const item = await prisma.galleryItem.create({
      data: { projectId, mediaUrl, mediaType, caption, altText, width, height, sortOrder },
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { projectId, itemId } = req.params;

    const userRole = (req as any).userRole;
    if (projectId.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects are read-only.' });
    }

    const project = await prisma.project.findFirst({ where: { id: projectId, userId: projectId.startsWith('demo-') ? 'system-demo' : userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { caption, altText, sortOrder } = req.body;

    const item = await prisma.galleryItem.update({
      where: { id: itemId },
      data: {
        ...(caption !== undefined && { caption }),
        ...(altText !== undefined && { altText }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    res.json({ item });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { projectId, itemId } = req.params;

    const userRole = (req as any).userRole;
    if (projectId.startsWith('demo-') && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'System showcase projects are read-only.' });
    }

    const project = await prisma.project.findFirst({ where: { id: projectId, userId: projectId.startsWith('demo-') ? 'system-demo' : userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await prisma.galleryItem.delete({ where: { id: itemId } });

    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    next(error);
  }
};
