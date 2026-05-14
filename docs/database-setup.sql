-- Mémoire Database Setup
-- Run this in your Neon dashboard SQL editor, OR use:
-- npx prisma migrate dev --name init

-- NOTE: Prisma handles migration automatically.
-- These are the raw SQL statements for reference.

CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED');
CREATE TYPE "ThemeName" AS ENUM ('ROMANTIC_GLOW', 'CINEMATIC_MEMORIES', 'SCRAPBOOK_LOVE');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "username" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "displayName" TEXT,
  "avatarUrl" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
  "emailVerifyToken" TEXT,
  "resetPasswordToken" TEXT,
  "resetPasswordExpiry" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "lastLoginAt" TIMESTAMP(3)
);

CREATE TABLE "RefreshToken" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "token" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isRevoked" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "theme" "ThemeName" NOT NULL DEFAULT 'ROMANTIC_GLOW',
  "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
  "personOneName" TEXT,
  "personTwoName" TEXT,
  "occasion" TEXT,
  "startDate" TIMESTAMP(3),
  "coverImageUrl" TEXT,
  "backgroundMusicUrl" TEXT,
  "heroConfig" JSONB,
  "endingConfig" JSONB,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "isPasswordProtected" BOOLEAN NOT NULL DEFAULT false,
  "accessPassword" TEXT,
  "publishedAt" TIMESTAMP(3),
  "scheduledFor" TIMESTAMP(3),
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Memory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "imageUrl" TEXT,
  "videoUrl" TEXT,
  "location" TEXT,
  "emoji" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "GalleryItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "mediaUrl" TEXT NOT NULL,
  "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
  "caption" TEXT,
  "altText" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MediaUpload" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "projectId" TEXT REFERENCES "Project"("id") ON DELETE SET NULL,
  "cloudinaryId" TEXT NOT NULL UNIQUE,
  "url" TEXT NOT NULL,
  "secureUrl" TEXT NOT NULL,
  "mediaType" "MediaType" NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "format" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "duration" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_username_idx" ON "User"("username");
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE INDEX "Project_userId_idx" ON "Project"("userId");
CREATE INDEX "Project_slug_idx" ON "Project"("slug");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE INDEX "Memory_projectId_idx" ON "Memory"("projectId");
CREATE INDEX "Memory_date_idx" ON "Memory"("date");
CREATE INDEX "GalleryItem_projectId_idx" ON "GalleryItem"("projectId");
CREATE INDEX "MediaUpload_userId_idx" ON "MediaUpload"("userId");
CREATE INDEX "MediaUpload_projectId_idx" ON "MediaUpload"("projectId");
CREATE INDEX "MediaUpload_cloudinaryId_idx" ON "MediaUpload"("cloudinaryId");
