import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para controlar se já estamos redirecionando
let isRedirecting = false;

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      
      console.log('Token inválido ou expirado');
      
      try {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
      } catch (e) {
        console.error('Erro ao limpar credenciais:', e);
      }
      
      // Aqui você pode usar navigation para redirecionar para login
      // Mas como o interceptor não tem acesso direto ao navigation,
      // vamos deixar isso para o store gerenciar
      
      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }
    return Promise.reject(error);
  }
);
