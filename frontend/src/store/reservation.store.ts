import { create } from 'zustand';
import type { Reservation, CreateReservationData } from '../types/reservation.types';
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
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyReservations: () => Promise<void>;
  fetchServiceReservations: () => Promise<void>;
  createReservation: (data: CreateReservationData) => Promise<Reservation>;
  cancelReservation: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservations: [],
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
      const reservations = await reservationService.getServiceReservations();
      set({ reservations, isLoading: false });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      console.error('Erro ao buscar reservas dos serviços:', error);
      set({ error: errorMessage, isLoading: false, reservations: [] });
    }
  },

  createReservation: async (data: CreateReservationData) => {
    set({ isLoading: true, error: null });
    try {
      const reservation = await reservationService.create(data);
      set((state) => ({
        reservations: [...state.reservations, reservation],
        isLoading: false,
      }));
      return reservation;
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
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
