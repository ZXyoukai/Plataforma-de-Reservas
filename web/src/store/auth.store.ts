import { create } from 'zustand';
import type { User } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserFromStorage: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ identifier, password });
      
      // Salvar no localStorage
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        // Se houver erro ao parsear, limpa o storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  clearError: () => set({ error: null }),
}));
