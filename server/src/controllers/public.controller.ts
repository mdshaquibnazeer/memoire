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
          select: { displayName: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Memory not found or not yet published' });
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
