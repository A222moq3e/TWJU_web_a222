import { Request, Response } from 'express';
import FlagService from '../services/flagService';
import { logger } from '../lib/logger';

export const getAdmin = async (req: Request, res: Response) => {
  try {
    // This endpoint is protected by requireAdmin middleware
    const flag = FlagService.getFlag();
    
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
