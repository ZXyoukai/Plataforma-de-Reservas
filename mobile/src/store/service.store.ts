import { create } from 'zustand';
import type { Service, CreateServiceData, UpdateServiceData } from '../types/service.types';
import { serviceService } from '../services/service.service';

interface ServiceState {
  services: Service[];
  myServices: Service[];
  currentService: Service | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllServices: () => Promise<void>;
  fetchMyServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<void>;
  createService: (data: CreateServiceData) => Promise<Service>;
  updateService: (id: string, data: UpdateServiceData) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentService: () => void;
}

// Função auxiliar para extrair mensagens de erro da API
function extractErrorMessage(error: any, defaultMessage: string): string {
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
  return defaultMessage;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  myServices: [],
  currentService: null,
  isLoading: false,
  error: null,

  fetchAllServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const services = await serviceService.getAll();
      set({ services, isLoading: false });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erro ao carregar serviços');
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchMyServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const myServices = await serviceService.getMyServices();
      set({ myServices, isLoading: false });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erro ao carregar seus serviços');
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchServiceById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const service = await serviceService.getById(id);
      set({ currentService: service, isLoading: false });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erro ao carregar serviço');
      set({ error: errorMessage, isLoading: false });
    }
  },

  createService: async (data: CreateServiceData) => {
    set({ isLoading: true, error: null });
    try {
      const service = await serviceService.create(data);
      
      // Adiciona o novo serviço à lista
      set((state) => ({
        myServices: [service, ...state.myServices],
        isLoading: false,
      }));
      
      return service;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erro ao criar serviço');
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateService: async (id: string, data: UpdateServiceData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedService = await serviceService.update(id, data);
      
      // Atualiza o serviço na lista
      set((state) => ({
        myServices: state.myServices.map((s) =>
          s.id === id ? updatedService : s
        ),
        currentService: state.currentService?.id === id ? updatedService : state.currentService,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erro ao atualizar serviço');
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteService: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await serviceService.delete(id);
      
      // Remove o serviço da lista
      set((state) => ({
        myServices: state.myServices.filter((s) => s.id !== id),
        currentService: state.currentService?.id === id ? null : state.currentService,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erro ao deletar serviço');
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentService: () => set({ currentService: null }),
}));
