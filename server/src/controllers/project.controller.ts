import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { generateSlug } from '../utils/slug';

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

    res.json({
      projects,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
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

    // Verify ownership
    const existing = await prisma.project.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const {
      title, subtitle, theme, personOneName, personTwoName,
      occasion, startDate, coverImageUrl, backgroundMusicUrl,
      heroConfig, endingConfig, seoTitle, seoDescription,
      isPasswordProtected, accessPassword,
    } = req.body;

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

    const existing = await prisma.project.findFirst({ where: { id, userId } });
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

    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

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

    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
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

    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
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

    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

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

    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
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

    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await prisma.galleryItem.delete({ where: { id: itemId } });

    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    next(error);
  }
};
