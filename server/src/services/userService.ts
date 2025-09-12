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
        role: data.role || 'student',
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
      displayName: user.profile?.displayName || undefined,
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
        role: 'student'
      },
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

  async updateUserProfile(userId: number, data: { displayName?: string }) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              displayName: data.displayName,
            },
            update: {
              displayName: data.displayName,
            }
          }
        }
      },
      include: { profile: true }
    });

    return updated;
  }

  async updateUserProfilePartial(userId: number, data: { displayName?: string; avatarSet?: boolean }) {
    const profileUpdate: any = {};
    if (typeof data.displayName !== 'undefined') {
      profileUpdate.displayName = data.displayName;
    }
    if (typeof data.avatarSet !== 'undefined') {
      profileUpdate.avatarSet = data.avatarSet;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: profileUpdate,
            update: profileUpdate
          }
        }
      },
      include: { profile: true }
    });

    return updated;
  }

  async setDisplayName(userId: number, displayName: string | undefined) {
    return this.updateUserProfilePartial(userId, { displayName });
  }

  async setGrade(userId: number, grade: string | undefined) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: ({
            create: { grade },
            update: { grade }
          } as any)
        }
      },
      include: { profile: true }
    });
    return updated;
  }

  async setEmail(userId: number, email: string) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { email },
      include: { profile: true }
    });
    return updated;
  }
}

export const userService = new UserService();