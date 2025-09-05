import apiClient from './client';

export interface AdminResponse {
  message: string;
  flag: string;
  timestamp: string;
}

export const adminApi = {
  getAdmin: async (): Promise<AdminResponse> => {
    const response = await apiClient.get('/admin/');
    return response.data;
  }
};
