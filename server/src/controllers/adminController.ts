import { Request, Response } from 'express';
import { logger } from '../lib/logger';

export const getAdmin = async (req: Request, res: Response) => {
  try {
    // This endpoint is protected by requireAdmin middleware
    const flag = 'FLAG{student-dashboard-rooted}';
    
    res.json({
      message: 'Welcome to the admin panel',
      flag: flag,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Admin access error:', error);
    res.status(500).json({ error: 'Admin access failed' });
  }
};
