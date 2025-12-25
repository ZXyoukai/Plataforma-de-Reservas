import { create } from 'zustand';
import type { Reservation, CreateReservationData, UpdateReservationStatusData } from '../types/reservation.types';
import { reservationService } from '../services/reservation.service';

// Helper para extrair mensagens de erro da API
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

interface ReservationState {
  reservations: Reservation[];
  serviceReservations: Reservation[];
  currentReservation: Reservation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyReservations: () => Promise<void>;
  fetchServiceReservations: () => Promise<void>;
  fetchReservationById: (id: string) => Promise<void>;
  createReservation: (data: CreateReservationData) => Promise<Reservation>;
  updateReservationStatus: (id: string, data: UpdateReservationStatusData) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentReservation: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservations: [],
  serviceReservations: [],
  currentReservation: null,
  isLoading: false,
  error: null,

  fetchMyReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const reservations = await reservationService.getMyReservations();
      set({ reservations, isLoading: false });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      console.error('Erro ao buscar minhas reservas:', error);
      set({ error: errorMessage, isLoading: false, reservations: [] });
    }
  },

  fetchServiceReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const serviceReservations = await reservationService.getServiceReservations();
      set({ serviceReservations, isLoading: false });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      console.error('Erro ao buscar reservas dos serviços:', error);
      set({ error: errorMessage, isLoading: false, serviceReservations: [] });
    }
  },

  fetchReservationById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const reservation = await reservationService.getById(id);
      set({ currentReservation: reservation, isLoading: false });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  createReservation: async (data: CreateReservationData) => {
    set({ isLoading: true, error: null });
    try {
      const reservation = await reservationService.create(data);
      set((state) => ({
        reservations: [reservation, ...state.reservations],
        isLoading: false,
      }));
      return reservation;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateReservationStatus: async (id: string, data: UpdateReservationStatusData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedReservation = await reservationService.updateStatus(id, data);
      
      // Atualiza nas duas listas
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? updatedReservation : r
        ),
        serviceReservations: state.serviceReservations.map((r) =>
          r.id === id ? updatedReservation : r
        ),
        currentReservation: state.currentReservation?.id === id ? updatedReservation : state.currentReservation,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  cancelReservation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await reservationService.cancel(id);
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
        serviceReservations: state.serviceReservations.filter((r) => r.id !== id),
        currentReservation: state.currentReservation?.id === id ? null : state.currentReservation,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentReservation: () => set({ currentReservation: null }),
}));
