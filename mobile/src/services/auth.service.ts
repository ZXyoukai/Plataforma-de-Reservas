import { api } from './api';
import * as SecureStore from 'expo-secure-store';
import type { AuthResponse, LoginData, RegisterData, User } from '../types/auth.types';

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/authentication/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>('/user-registration', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/authentication/profile');
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },
};
