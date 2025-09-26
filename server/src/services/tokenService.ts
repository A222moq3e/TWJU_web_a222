import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';

interface TokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

class TokenService {
  private getJwtSecret(): string {
    // Read JWT secret from environment variable (from .env file)
    if (process.env.JWT_SECRET) {
      return process.env.JWT_SECRET;
    }

    throw new Error('JWT_SECRET not found in environment variables. Please set JWT_SECRET in your .env file');
  }

  generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    const secret = this.getJwtSecret();
    return jwt.sign(payload, secret, { 
      algorithm: 'HS256',
      expiresIn: '24h'
    });
  }

  verifyToken(token: string): TokenPayload {
    const secret = this.getJwtSecret();
    return jwt.verify(token, secret, { algorithms: ['HS256'] }) as TokenPayload;
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}

export const tokenService = new TokenService();
export { TokenPayload };
