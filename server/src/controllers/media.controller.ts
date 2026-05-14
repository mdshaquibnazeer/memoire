import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../config/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// UPLOAD MEDIA
// ============================================

export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { projectId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Maximum 100MB.' });
    }

    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    const isAudio = file.mimetype.startsWith('audio/');

    if (!isImage && !isVideo && !isAudio) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Upload to Cloudinary
    const resourceType = isImage ? 'image' : isVideo ? 'video' : 'video'; // audio uses 'video' type

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `memoire/${userId}`,
          resource_type: resourceType,
          transformation: isImage ? [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 2000, height: 2000, crop: 'limit' },
          ] : undefined,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    let mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' = 'IMAGE';
    if (isVideo) mediaType = 'VIDEO';
    if (isAudio) mediaType = 'AUDIO';

    // Save to database
    const mediaUpload = await prisma.mediaUpload.create({
      data: {
        userId,
        projectId: projectId || null,
        cloudinaryId: uploadResult.public_id,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        mediaType,
        fileName: file.originalname,
        fileSize: file.size,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
      },
    });

    res.status(201).json({
      media: mediaUpload,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE MEDIA
// ============================================

export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const media = await prisma.mediaUpload.findFirst({
      where: { id, userId },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete from Cloudinary
    const resourceType = media.mediaType === 'IMAGE' ? 'image' : 'video';
    await cloudinary.uploader.destroy(media.cloudinaryId, { resource_type: resourceType });

    // Delete from DB
    await prisma.mediaUpload.delete({ where: { id } });

    res.json({ message: 'Media deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// LIST USER MEDIA
// ============================================

export const getUserMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { type, page = '1', limit = '20' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { userId };
    if (type) where.mediaType = type;

    const [media, total] = await Promise.all([
      prisma.mediaUpload.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mediaUpload.count({ where }),
    ]);

    res.json({ media, total });
  } catch (error) {
    next(error);
  }
};
