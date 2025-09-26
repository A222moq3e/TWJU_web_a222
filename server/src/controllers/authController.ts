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
      id: user.id.toString(),
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
      id: user.id.toString(),
      role: user.role
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName,
        avatar: user.profile?.avatar || 'default-1.png'
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
    const userId = parseInt((req as any).user.id);
    // Load user with enrollments/courses to mirror former /me/dashboard
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
        avatar: user.profile?.avatar || 'default-1.png'
      },
      courses: user.enrollments?.map(enrollment => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        enrolledAt: enrollment.enrolledAt
      })) || []
    };

    // Check JWT role for admin panel access (CTF vulnerability)
    const jwtRole = (req as any).user.role;
    if (jwtRole === 'admin') {
      payload.adminPanel = {
        message: 'Welcome to the admin panel',
        flag: 'FLAG{student-dashboard-rooted}',
        timestamp: new Date().toISOString()
      };
    }

    res.json(payload);
  } catch (error) {
    logger.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};

export const getMyDashboard = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.id);
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
        avatar: user.profile?.avatar || 'default-1.png'
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
    const userId = parseInt((req as any).user.id);
    const { displayName } = req.body as { displayName?: string };
    const updated = await userService.setDisplayName(userId, displayName);
    res.json({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      displayName: updated.profile?.displayName,
      avatar: updated.profile?.avatar || 'default-1.png',
      grade: (updated as any).profile?.grade
    });
  } catch (error) {
    logger.error('Update name error:', error);
    res.status(500).json({ error: 'Failed to update name' });
  }
};

export const updateMyEmail = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.id);
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const updated = await userService.setEmail(userId, email);
    res.json({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      displayName: updated.profile?.displayName,
      avatar: updated.profile?.avatar || 'default-1.png',
      grade: (updated as any).profile?.grade
    });
  } catch (error) {
    logger.error('Update email error:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
};



// Multer setup for avatar uploads
const upload = multer({ dest: path.join(process.cwd(), 'server', 'uploads', 'tmp') });

export const uploadAvatarMiddleware = upload.single('avatar');

export const updateMyAvatar = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.id);
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'Avatar file is required' });
    }

    // Get user to get the avatar name from database
    const user = await userService.findUserById(userId);
    if (!user || !user.profile?.avatar) {
      return res.status(400).json({ error: 'Avatar name not set. Call updateAvatarName first.' });
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Enhanced debugging for upload process
    logger.info(`[UPLOAD DEBUG] Current working directory: ${process.cwd()}`);
    logger.info(`[UPLOAD DEBUG] Uploads directory: ${uploadsDir}`);
    logger.info(`[UPLOAD DEBUG] Avatar name from DB: ${user.profile.avatar}`);
    logger.info(`[UPLOAD DEBUG] Uploaded file path: ${file.path}`);
    logger.info(`[UPLOAD DEBUG] Uploaded file size: ${file.size} bytes`);
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      logger.info(`[UPLOAD DEBUG] Creating uploads directory: ${uploadsDir}`);
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file with the name stored in database
    const targetPath = path.join(uploadsDir, user.profile.avatar);
    logger.info(`[UPLOAD DEBUG] Saving avatar to: ${targetPath}`);
    
    fs.copyFileSync(file.path, targetPath);
    fs.unlinkSync(file.path);
    
    // Verify file was saved correctly
    logger.info(`[UPLOAD DEBUG] File saved successfully: ${fs.existsSync(targetPath)}`);

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.profile?.displayName,
      avatar: user.profile.avatar
    });
  } catch (error) {
    logger.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
};

export const updateAvatarName = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.id);
    const { avatarName } = req.body;

    if (!avatarName) {
      return res.status(400).json({ error: 'Avatar name is required' });
    }

    const updated = await userService.updateAvatarName(userId, avatarName);

    res.json({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      displayName: updated.profile?.displayName,
      avatar: updated.profile?.avatar || 'default-1.png'
    });
  } catch (error) {
    logger.error('Update avatar name error:', error);
    res.status(500).json({ error: 'Failed to update avatar name' });
  }
};

export const getMyAvatar = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.id);
    const user = await userService.findUserById(userId);
    
    if (!user || !user.profile?.avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    console.log('user.profile.avatar',user.profile.avatar);
    
    // Basic validation - intentionally vulnerable to path traversal
    const fileName = user.profile.avatar;
    
    // Naive validation that misses encoded traversal
    if (fileName.includes('etc') || fileName.includes('passwd') || fileName.includes('shadow') || fileName.includes('hosts') || fileName.includes('resolv.conf')) {
      return res.status(400).json({ error: 'unauthorized action :<' });
    }
    
    // Avatar files are stored directly in uploads/ with the name from database
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const avatarPath = path.join(uploadsDir, user.profile.avatar);
    
    // Enhanced debugging for server deployment
    logger.info(`[DEBUG] Current working directory: ${process.cwd()}`);
    logger.info(`[DEBUG] Uploads directory: ${uploadsDir}`);
    logger.info(`[DEBUG] Uploads directory exists: ${fs.existsSync(uploadsDir)}`);
    logger.info(`[DEBUG] Avatar filename from DB: ${user.profile.avatar}`);
    logger.info(`[DEBUG] Full avatar path: ${avatarPath}`);
    logger.info(`[DEBUG] Avatar file exists: ${fs.existsSync(avatarPath)}`);
    
    // List files in uploads directory for debugging
    if (fs.existsSync(uploadsDir)) {
      try {
        const files = fs.readdirSync(uploadsDir);
        logger.info(`[DEBUG] Files in uploads directory: ${JSON.stringify(files)}`);
      } catch (err) {
        logger.error(`[DEBUG] Error reading uploads directory: ${err}`);
      }
    }
    
    if (!fs.existsSync(avatarPath)) {
      logger.info(`[DEBUG] Avatar file not found: ${avatarPath}`);
      return res.status(404).json({ error: 'Avatar file not found' });
    }
    
    // Determine content type based on file extension
    const ext = path.extname(user.profile.avatar).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.env') contentType = 'text/plain';
    
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(avatarPath).pipe(res);
  } catch (error) {
    logger.error('Get avatar error:', error);
    res.status(500).json({ error: 'Failed to get avatar' });
  }
};