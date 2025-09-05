import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

class TokenService {
  private getJwtSecret(): string {
    try {
      // Read JWT secret from /etc/.env
      const envPath = '/etc/.env';
      const envContent = fs.readFileSync(envPath, 'utf8');
      const jwtSecretMatch = envContent.match(/JWT_SECRET=(.+)/);
      
      if (!jwtSecretMatch) {
        throw new Error('JWT_SECRET not found in /etc/.env');
      }
      
      return jwtSecretMatch[1].trim();
    } catch (error) {
      logger.error('Failed to read JWT secret from /etc/.env:', error);
      throw new Error('JWT secret not available');
    }
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
