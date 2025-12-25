import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User, RegisterData } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCheckedStorage: boolean;
  
  // Actions
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUserFromStorage: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const extractErrorMessage = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data;
    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    } else if (typeof data.message === 'string') {
      return data.message;
    } else if (data.error) {
      return data.error;
    }
  }
  return error.message || 'Erro desconhecido';
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasCheckedStorage: false,

  login: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ identifier, password });
      
      // Salvar no SecureStore
      await SecureStore.setItemAsync('token', response.accessToken);
      await SecureStore.setItemAsync('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(data);
      
      // Após registro, faz login automaticamente
      await useAuthStore.getState().login(data.email, data.password);
      
      set({
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    console.log('Fazendo logout...');
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      hasCheckedStorage: true,
    });
  },

  loadUserFromStorage: async () => {
    try {
      console.log('Verificando storage...');
      const token = await SecureStore.getItemAsync('token');
      const userStr = await SecureStore.getItemAsync('user');
      
      console.log('Token encontrado:', token ? 'sim' : 'não');
      console.log('User encontrado:', userStr ? 'sim' : 'não');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
          hasCheckedStorage: true,
        });
        console.log('Usuário carregado do storage:', user.email);
      } else {
        console.log('Nenhum dado no storage');
        set({ hasCheckedStorage: true });
      }
    } catch (error) {
      console.error('Erro ao carregar do storage:', error);
      set({ hasCheckedStorage: true });
    }
  },

  clearError: () => set({ error: null }),
  
  updateUser: (user: User) => set({ user }),
}));
