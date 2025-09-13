import { Request, Response } from 'express';
import { userService } from '../services/userService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { tokenService } from '../services/tokenService';
import { logger } from '../lib/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await userService.createUser({ email, password });
    const token = tokenService.generateToken({
      sub: user.id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await userService.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = tokenService.generateToken({
      sub: user.id.toString(),
      email: user.email,
      role: user.role
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName,
        avatarSet: user.profile?.avatarSet || false
      },
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.profile?.displayName,
      avatarSet: userService.checkAvatarExists(user.id)
    });
  } catch (error) {
    logger.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};

export const getMyDashboard = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const user = await userService.getUserWithCourses(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const payload: any = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName,
        avatarSet: user.profile?.avatarSet || false
      },
      courses: user.enrollments?.map(enrollment => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        enrolledAt: enrollment.enrolledAt
      })) || []
    };

    if (user.role === 'admin') {
      payload.adminPanel = {
        message: 'Welcome to the admin panel',
        flag: 'FLAG{student-dashboard-rooted}',
        timestamp: new Date().toISOString()
      };
    }

    res.json(payload);
  } catch (error) {
    logger.error('Get my dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
};

export const updateMyName = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const { displayName } = req.body as { displayName?: string };
    const updated = await userService.setDisplayName(userId, displayName);
    res.json({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      displayName: updated.profile?.displayName,
      avatarSet: updated.profile?.avatarSet || false,
      grade: (updated as any).profile?.grade
    });
  } catch (error) {
    logger.error('Update name error:', error);
    res.status(500).json({ error: 'Failed to update name' });
  }
};

export const updateMyEmail = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const updated = await userService.setEmail(userId, email);
    res.json({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      displayName: updated.profile?.displayName,
      avatarSet: updated.profile?.avatarSet || false,
      grade: (updated as any).profile?.grade
    });
  } catch (error) {
    logger.error('Update email error:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
};

export const updateMyGrade = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const { grade } = req.body as { grade?: string };
    const updated = await userService.setGrade(userId, grade);
    res.json({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      displayName: updated.profile?.displayName,
      avatarSet: updated.profile?.avatarSet || false,
      grade: (updated as any).profile?.grade
    });
  } catch (error) {
    logger.error('Update grade error:', error);
    res.status(500).json({ error: 'Failed to update grade' });
  }
};

// Multer setup for avatar uploads
const upload = multer({ dest: path.join(process.cwd(), 'server', 'uploads', 'tmp') });

export const uploadAvatarMiddleware = upload.single('avatar');

export const updateMyAvatar = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'Avatar file is required' });
    }

    const uploadsDir = path.join(process.cwd(), 'server', 'uploads', String(userId));
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const targetPath = path.join(uploadsDir, 'avatar.png');
    fs.copyFileSync(file.path, targetPath);
    fs.unlinkSync(file.path);

    const updated = await userService.findUserById(userId);

    res.json({
      id: updated!.id,
      email: updated!.email,
      role: updated!.role,
      displayName: updated!.profile?.displayName,
      avatarSet: userService.checkAvatarExists(userId)
    });
  } catch (error) {
    logger.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
};

export const getMyAvatar = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const avatarPath = path.join(process.cwd(), 'server', 'uploads', String(userId), 'avatar.png');
    if (!fs.existsSync(avatarPath)) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    res.setHeader('Content-Type', 'image/png');
    fs.createReadStream(avatarPath).pipe(res);
  } catch (error) {
    logger.error('Get avatar error:', error);
    res.status(500).json({ error: 'Failed to get avatar' });
  }
};