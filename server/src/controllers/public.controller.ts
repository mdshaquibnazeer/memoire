import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

// ============================================
// GET PUBLIC PROJECT BY SLUG
// ============================================

export const getPublicProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { password } = req.query;

    const project = await prisma.project.findFirst({
      where: {
        slug,
        OR: [
          { status: 'PUBLISHED' },
          { status: 'SCHEDULED', scheduledFor: { lte: new Date() } },
        ],
      },
      include: {
        memories: { orderBy: { date: 'asc' } },
        galleryItems: { orderBy: { sortOrder: 'asc' } },
        user: {
          select: { id: true, displayName: true, isSuspended: true, themeExpirations: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Memory not found or not yet published' });
    }

    if (project.user.isSuspended) {
      return res.status(403).json({ error: 'This memory has been temporarily offline' });
    }

    const expirations = (project.user.themeExpirations as any) || {};
    const expiry = expirations[project.theme];
    if (expiry && new Date(expiry) < new Date()) {
      return res.status(403).json({ error: 'This memory theme authorization has expired.' });
    }

    // Password check
    if (project.isPasswordProtected) {
      if (!password || password !== project.accessPassword) {
        return res.status(403).json({
          error: 'This memory is password protected',
          requiresPassword: true,
        });
      }
    }

    // Increment view count (fire and forget)
    prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Strip sensitive fields
    const { accessPassword, ...safeProject } = project;

    res.json({ project: safeProject });
  } catch (error) {
    next(error);
  }
};

// ============================================
// SUBMIT PUBLIC WISH FOR A PROJECT
// ============================================

export const submitPublicWish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { wish, name } = req.body;

    if (!wish || typeof wish !== 'string') {
      return res.status(400).json({ error: 'Wish is required' });
    }

    const wordCount = wish.split(/\s+/).filter(Boolean).length;
    if (wordCount > 50) {
      return res.status(400).json({ error: 'Wish must be under 50 words' });
    }

    const project = await prisma.project.findFirst({
      where: {
        slug,
        OR: [
          { status: 'PUBLISHED' },
          { status: 'SCHEDULED', scheduledFor: { lte: new Date() } },
        ],
      },
      include: {
        user: { select: { isSuspended: true, themeExpirations: true } }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Memory not found or not yet published' });
    }

    if (project.user.isSuspended) {
      return res.status(403).json({ error: 'This memory has been temporarily offline' });
    }

    const expirations = (project.user.themeExpirations as any) || {};
    const expiry = expirations[project.theme];
    if (expiry && new Date(expiry) < new Date()) {
      return res.status(403).json({ error: 'This memory theme authorization has expired.' });
    }

    // Append to wishes inside heroConfig JSON
    const heroConfig = (project.heroConfig as any) || {};
    const wishes = heroConfig.wishes || [];
    const newWish = {
      id: Math.random().toString(36).substring(2, 9),
      wish,
      name: name || 'Anonymous',
      createdAt: new Date().toISOString(),
    };
    wishes.push(newWish);
    heroConfig.wishes = wishes;

    await prisma.project.update({
      where: { id: project.id },
      data: { heroConfig },
    });

    res.json({ success: true, wish: newWish });
  } catch (error) {
    next(error);
  }
};
