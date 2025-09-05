import bcrypt from 'bcryptjs';
import prisma from '../lib/db';
import { logger } from '../lib/logger';

export interface CreateUserData {
  email: string;
  password: string;
  role?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  role: string;
  displayName?: string;
  avatarSet: boolean;
}

class UserService {
  async createUser(data: CreateUserData): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role || 'user',
        profile: {
          create: {
            displayName: data.email.split('@')[0],
            avatarSet: false
          }
        }
      },
      include: {
        profile: true
      }
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.profile?.displayName,
      avatarSet: user.profile?.avatarSet || false
    };
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    });
  }

  async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getStudents() {
    return prisma.user.findMany({
      where: {
        role: 'user'
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            displayName: true
          }
        }
      }
    });
  }

  async getAdminInfo() {
    return prisma.user.findFirst({
      where: {
        role: 'admin'
      },
      include: {
        profile: true
      }
    });
  }

  async getUserWithCourses(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        enrollments: {
          include: {
            course: true
          }
        }
      }
    });
  }
}

export const userService = new UserService();