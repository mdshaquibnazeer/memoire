import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [userCount, projectCount, publishedCount, mediaCount, pendingApprovalCount] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'PUBLISHED' } }),
      prisma.mediaUpload.count(),
      prisma.user.count({ where: { isApproved: false } }),
    ]);

    res.json({ userCount, projectCount, publishedCount, mediaCount, pendingApprovalCount });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, username: true, displayName: true,
          role: true, isEmailVerified: true, isApproved: true, isSuspended: true,
          allowedTemplates: true, themeExpirations: true, userLimits: true,
          createdAt: true, lastLoginAt: true,
          _count: { select: { projects: true } },
        },
      }),
      prisma.user.count(),
    ]);

    res.json({ users, total });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, username: true } },
          _count: { select: { memories: true, galleryItems: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({ projects, total });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted by admin' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted by admin' });
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });
    res.json({ message: 'User approved successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateUserTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { allowedTemplates } = req.body;
    await prisma.user.update({
      where: { id },
      data: { allowedTemplates },
    });
    res.json({ message: 'User template authorization updated' });
  } catch (error) {
    next(error);
  }
};

export const suspendUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body;
    await prisma.user.update({
      where: { id },
      data: { isSuspended },
    });
    res.json({ message: isSuspended ? 'User suspended successfully' : 'User unsuspended successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateUserAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { allowedTemplates, themeExpirations, userLimits } = req.body;
    await prisma.user.update({
      where: { id },
      data: {
        ...(allowedTemplates && { allowedTemplates }),
        ...(themeExpirations !== undefined && { themeExpirations }),
        ...(userLimits !== undefined && { userLimits }),
      },
    });
    res.json({ message: 'User access rules updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleProjectStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await prisma.project.update({
      where: { id },
      data: { status },
    });
    res.json({ message: `Project status changed to ${status}` });
  } catch (error) {
    next(error);
  }
};
