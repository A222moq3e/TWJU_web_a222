import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { logger } from '../lib/logger';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await userService.getStudents();
    const adminInfo = await userService.getAdminInfo();

    const result = students.map(student => ({
      id: student.id,
      name: student.profile?.displayName || 'Student',
      email: student.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      grade: (student as any).profile?.grade || null,
      courses: (student as any).enrollments?.map((enrollment: any) => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        enrolledAt: enrollment.enrolledAt
      })) || [],
      supervisor: {
        id: adminInfo?.id || null,
        email: adminInfo?.email || null,
        role: adminInfo?.role || null,
        userId: adminInfo?.id || null,
        displayName: adminInfo?.profile?.displayName || null,
        avatar: adminInfo?.profile?.avatar || 'default-1.png'
      }
    }));

    res.json(result);
  } catch (error) {
    logger.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).user.sub);
    const user = await userService.getUserWithCourses(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
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
    });
  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
};