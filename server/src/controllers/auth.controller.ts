import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/prisma';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';

// ============================================
// HELPERS
// ============================================

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET || 'fallback-secret',
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any }
  );
};

const generateRefreshToken = async (userId: string) => {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
};

// ============================================
// REGISTER
// ============================================

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, displayName } = req.body;

    // Check existing
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return res.status(409).json({
        error: existing.email === email
          ? 'Email already registered'
          : 'Username already taken',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerifyToken = uuidv4();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username: username.toLowerCase(),
        passwordHash,
        displayName: displayName || username,
        emailVerifyToken,
        isApproved: false,
        allowedTemplates: ['SCRAPBOOK_LOVE'],
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        isEmailVerified: true,
        isApproved: true,
        allowedTemplates: true,
        createdAt: true,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, emailVerifyToken, displayName || username);

    res.status(201).json({
      message: 'Account created! Please verify your email.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// LOGIN
// ============================================

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ error: 'Your account is pending approval by an admin.' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isApproved: user.isApproved,
        allowedTemplates: user.allowedTemplates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// REFRESH TOKEN
// ============================================

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Rotate refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const newAccessToken = generateAccessToken(storedToken.user.id, storedToken.user.role);
    const newRefreshToken = await generateRefreshToken(storedToken.user.id);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

// ============================================
// LOGOUT
// ============================================

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { isRevoked: true },
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// VERIFY EMAIL
// ============================================

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerifyToken: null },
    });

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// FORGOT PASSWORD
// ============================================

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond the same way for security
    if (user) {
      const token = uuidv4();
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);

      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: token, resetPasswordExpiry: expiry },
      });

      await sendPasswordResetEmail(email, token, user.displayName || user.username);
    }

    res.json({ message: 'If this email exists, you will receive a reset link.' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// RESET PASSWORD
// ============================================

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    // Revoke all refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET CURRENT USER
// ============================================

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        isEmailVerified: true,
        isApproved: true,
        allowedTemplates: true,
        createdAt: true,
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
