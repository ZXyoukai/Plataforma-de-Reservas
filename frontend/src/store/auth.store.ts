import { create } from 'zustand';
import type { User, RegisterData } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCheckedStorage: boolean; // Flag para saber se já verificou o localStorage
  
  // Actions
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
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
  hasCheckedStorage: false,

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
      // Extrai mensagem de erro detalhada da API
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response?.data) {
        const data = error.response.data;
        // Se for array de mensagens (validação)
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join(', ');
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      }
      
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
      
      // Após registro bem-sucedido, faz login automaticamente
      await useAuthStore.getState().login(data.email, data.password);
      
      set({
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Extrai mensagem de erro detalhada da API
      let errorMessage = 'Erro ao criar conta';
      
      if (error.response?.data) {
        const data = error.response.data;
        // Se for array de mensagens (validação)
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join(', ');
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      }
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    console.log('Fazendo logout...');
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      hasCheckedStorage: true, // Mantém true para não mostrar loading
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
          hasCheckedStorage: true,
        });
        console.log('Usuário carregado do localStorage:', user.email);
      } catch (error) {
        // Se houver erro ao parsear, limpa o storage
        console.error('Erro ao carregar usuário do storage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ hasCheckedStorage: true });
      }
    } else {
      // Não tem dados no storage
      set({ hasCheckedStorage: true });
    }
  },

  clearError: () => set({ error: null }),
}));
