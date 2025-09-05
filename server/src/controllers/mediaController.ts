import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';

export const getFile = async (req: Request, res: Response) => {
  try {
    const { userId, file } = req.query;

    if (!userId || !file) {
      return res.status(400).json({ error: 'userId and file parameters are required' });
    }

    // Basic validation - intentionally vulnerable to path traversal
    const fileName = file as string;
    const userIdStr = userId as string;

    // Naive validation that misses encoded traversal
    if (fileName.includes('..') || fileName.includes('//')) {
      return res.status(400).json({ error: 'Invalid file name' });
    }

    // Construct file path - vulnerable to path traversal
    const basePath = '/var/app/uploads';
    const filePath = path.join(basePath, userIdStr, fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Read file and send
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.txt') contentType = 'text/plain';
    else if (ext === '.env') contentType = 'text/plain';

    res.setHeader('Content-Type', contentType);
    res.send(fileBuffer);

  } catch (error) {
    logger.error('File read error:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
};
