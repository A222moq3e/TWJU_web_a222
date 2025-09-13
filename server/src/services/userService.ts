import bcrypt from 'bcryptjs';
import prisma from '../lib/db';
import { logger } from '../lib/logger';
import fs from 'fs';
import path from 'path';

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
  avatarSet: boolean; // This will be computed by checking if avatar file exists
}

class UserService {
  checkAvatarExists(userId: number): boolean {
    const avatarPath = path.join(process.cwd(), 'server', 'uploads', String(userId), 'avatar.png');
    const exists = fs.existsSync(avatarPath);
    logger.info(`Checking avatar for user ${userId}: ${avatarPath} - exists: ${exists}`);
    return exists;
  }

  async createUser(data: CreateUserData): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role || 'student',
        profile: {
          create: {
            displayName: data.email.split('@')[0]
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Copy default avatar for new user
    try {
      const defaultAvatarPath = path.join(process.cwd(), 'server', 'uploads', 'default-1.png');
      const userUploadsDir = path.join(process.cwd(), 'server', 'uploads', String(user.id));

      
      
      logger.info(`Copying default avatar for user ${user.id}`, {
        defaultAvatarPath,
        userUploadsDir,
        defaultExists: fs.existsSync(defaultAvatarPath),
        processCwd: process.cwd(),
        __dirname: __dirname
      });
      
      // Create user's upload directory
      if (!fs.existsSync(userUploadsDir)) {
        fs.mkdirSync(userUploadsDir, { recursive: true });
      }
      
      // Copy default avatar if it exists
      if (fs.existsSync(defaultAvatarPath)) {
        const userAvatarPath = path.join(userUploadsDir, 'avatar.png');
        fs.copyFileSync(defaultAvatarPath, userAvatarPath);
        logger.info(`Successfully copied default avatar to: ${userAvatarPath}`);
        logger.info(`User avatar file exists after copy: ${fs.existsSync(userAvatarPath)}`);
      } else {
        logger.warn(`Default avatar not found at: ${defaultAvatarPath}`);
        logger.warn(`Directory listing of uploads folder:`, fs.readdirSync(path.join(process.cwd(), 'server', 'uploads')).join(', '));
      }
    } catch (error) {
      logger.error('Failed to copy default avatar:', error);
    }

    // Ensure new students are enrolled in at least 3 courses
    try {
      // Count existing courses
      const courseCount = await prisma.course.count();
      // If fewer than 3 exist, create default ones
      if (courseCount < 3) {
        const defaults = [
          { title: 'Orientation 101', description: 'Welcome and orientation', sectionNumber: '001', courseCode: 'OR101', hours: 1 },
          { title: 'Study Skills', description: 'Effective learning strategies', sectionNumber: '001', courseCode: 'SS201', hours: 2 },
          { title: 'Campus Safety', description: 'Safety and security overview', sectionNumber: '001', courseCode: 'CS100', hours: 1 },
        ];
        // Create only the missing number to reach 3
        for (let i = 0; i < 3 - courseCount; i++) {
          await prisma.course.create({ data: defaults[i] });
        }
      }

      // Fetch 3 courses (any)
      const courses = await prisma.course.findMany({ take: 3, orderBy: { id: 'asc' } });
      // Enroll the user into those courses (skip if already enrolled)
      for (const course of courses) {
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: user.id, courseId: course.id } },
          update: {},
          create: { userId: user.id, courseId: course.id }
        });
      }
    } catch (e) {
      // Best-effort enrollment; don't block registration
      (logger as any)?.warn?.('Enrollment during registration failed', e);
    }

    // Fetch updated user data to get correct avatarSet value
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true }
    });

    return {
      id: updatedUser!.id,
      email: updatedUser!.email,
      role: updatedUser!.role,
      displayName: updatedUser!.profile?.displayName || undefined,
      avatarSet: this.checkAvatarExists(updatedUser!.id)
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

  async updateUserProfilePartial(userId: number, data: { displayName?: string }) {
    const profileUpdate: any = {};
    if (typeof data.displayName !== 'undefined') {
      profileUpdate.displayName = data.displayName;
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