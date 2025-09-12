import apiClient from './client';

export interface Student {
  id: number;
  name: string;
  email: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  enrolledAt: string;
}

export interface DashboardData {
  user: {
    id: number;
    email: string;
    role: string;
    displayName?: string;
    avatarSet: boolean;
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
    const response = await apiClient.get('/auth/me/dashboard');
    return response.data;
  }
};
