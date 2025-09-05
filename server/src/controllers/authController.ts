import { Request, Response } from 'express';
import { userService } from '../services/userService';
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
      avatarSet: user.profile?.avatarSet || false
    });
  } catch (error) {
    logger.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};
