import apiClient from './client';

export interface User {
  id: number;
  email: string;
  role: string;
  displayName?: string;
  avatarSet: boolean;
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
    return response.data;
  }
};
