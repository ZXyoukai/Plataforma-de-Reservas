import axios from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    // Apenas faz logout em 401 se for erro de token inválido/expirado
    // Não faz logout em erro de credenciais inválidas no login
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      const isRegisterPage = window.location.pathname === '/register';
      
      // Não redireciona se já estiver na página de login/registro
      if (!isLoginPage && !isRegisterPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
