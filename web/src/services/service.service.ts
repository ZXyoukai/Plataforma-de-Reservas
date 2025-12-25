import { api } from './api';
import type { Service, CreateServiceData, UpdateServiceData } from '../types/service.types';

export const serviceService = {
  // Criar novo serviço (apenas prestadores)
  create: async (data: CreateServiceData): Promise<Service> => {
    const response = await api.post<Service>('/services', data);
    return response.data;
  },

  // Listar todos os serviços
  getAll: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },

  // Listar serviços do prestador autenticado
  getMyServices: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services/my-services');
    return response.data;
  },

  // Buscar serviço por ID
  getById: async (id: string): Promise<Service> => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  // Atualizar serviço
  update: async (id: string, data: UpdateServiceData): Promise<Service> => {
    const response = await api.put<Service>(`/services/${id}`, data);
    return response.data;
  },

  // Deletar serviço
  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
