import apiClient from './client';

export interface User {
  id: number;
  email: string;
  role: string;
  displayName?: string;
  avatar: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },

  updateMe: async (payload: { displayName?: string }): Promise<User> => {
    const response = await apiClient.put('/auth/me', payload);
    return response.data;
  },

  patchName: async (displayName?: string): Promise<User> => {
    const response = await apiClient.patch('/auth/me/name', { displayName });
    return response.data;
  },

  patchEmail: async (email: string): Promise<User> => {
    const response = await apiClient.patch('/auth/me/email', { email });
    return response.data;
  },

  patchGrade: async (grade?: string): Promise<User> => {
    const response = await apiClient.patch('/auth/me/grade', { grade });
    return response.data;
  },

  updateAvatarName: async (avatarName: string): Promise<User> => {
    const response = await apiClient.patch('/auth/me/avatar/name', { avatarName });
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const form = new FormData();
    form.append('avatar', file);
    const response = await apiClient.post('/auth/me/avatar/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
