import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import mediaRoutes from './routes/media.routes';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';
import { prisma } from './config/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait 15 seconds.' },
});

app.use(generalLimiter);

// ============================================
// BODY PARSING
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// LOGGING
// ============================================

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const runMigration = async () => {
  try {
    console.log('🌹 Starting auto schema migration...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN NOT NULL DEFAULT false;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "allowedTemplates" TEXT[] NOT NULL DEFAULT ARRAY['SCRAPBOOK_LOVE']::TEXT[];
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "isSuspended" BOOLEAN NOT NULL DEFAULT false;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "allowedDemoPreviews" TEXT[] NOT NULL DEFAULT ARRAY['ROMANTIC_GLOW', 'CINEMATIC_MEMORIES', 'AURORA_DREAMS', 'CELESTIAL_BIRTHDAY']::TEXT[];
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "themeExpirations" JSONB NULL;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "userLimits" JSONB NULL;
    `);
    
    // Promote md_shaquib_nazeer to ADMIN and isApproved: true
    await prisma.$executeRawUnsafe(`
      UPDATE "User"
      SET "role" = 'ADMIN', "isApproved" = true, "allowedTemplates" = ARRAY['ROMANTIC_GLOW', 'CINEMATIC_MEMORIES', 'SCRAPBOOK_LOVE', 'AURORA_DREAMS', 'CELESTIAL_BIRTHDAY']::TEXT[]
      WHERE "username" = 'md_shaquib_nazeer';
    `);

    // Approve testuser2
    await prisma.$executeRawUnsafe(`
      UPDATE "User"
      SET "isApproved" = true
      WHERE "username" = 'testuser2';
    `);

    console.log('🌹 Auto schema migration completed successfully!');
  } catch (error) {
    console.error('🌹 Auto schema migration failed:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`\n🌹 Mémoire Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
  await runMigration();
});

export default app;
