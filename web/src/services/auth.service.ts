import { api } from './api';
import type { LoginCredentials, AuthResponse } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Determina se o identificador é email ou NIF
    const isEmail = credentials.identifier.includes('@');
    
    const response = await api.post<AuthResponse>('/authentication/login', {
      [isEmail ? 'email' : 'nif']: credentials.identifier,
      password: credentials.password,
    });
    
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>('/authentication/profile');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
