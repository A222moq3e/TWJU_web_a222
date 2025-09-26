import apiClient from './client';

export interface Student {
  id: number;
  name: string;
  email: string;
  grade: string | null;
  courses: Course[];
  supervisor: {
    id: number | null;
    email: string | null;
    role: string | null;
    userId: number | null;
    displayName: string | null;
    avatar: string;
  };
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  enrolledAt: string;
  sectionNumber?: string;
  courseCode?: string;
  hours?: number;
}

export interface DashboardData {
  user: {
    id: number;
    email: string;
    role: string;
    displayName?: string;
    avatar: string;
  };
  courses: Course[];
  adminPanel?: {
    message: string;
    flag: string;
    timestamp: string;
  }
}

export const studentsApi = {
  getStudents: async (): Promise<Student[]> => {
    const response = await apiClient.get('/students/');
    return response.data;
  },

  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};
