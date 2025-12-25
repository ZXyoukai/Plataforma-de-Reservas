import { api } from './api';
import type { Reservation, CreateReservationData, UpdateReservationStatusData } from '../types/reservation.types';

export const reservationService = {
  // Criar nova reserva (apenas clientes)
  create: async (data: CreateReservationData): Promise<Reservation> => {
    const response = await api.post<Reservation>('/reservations', data);
    return response.data;
  },

  // Listar minhas reservas (cliente)
  getMyReservations: async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>('/reservations/my-reservations');
    return response.data;
  },

  // Listar reservas dos meus serviços (prestador)
  getServiceReservations: async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>('/reservations/service-reservations');
    return response.data;
  },

  // Buscar reserva por ID
  getById: async (id: string): Promise<Reservation> => {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  // Atualizar status da reserva (prestador)
  updateStatus: async (id: string, data: UpdateReservationStatusData): Promise<Reservation> => {
    const response = await api.put<Reservation>(`/reservations/${id}/status`, data);
    return response.data;
  },

  // Cancelar reserva (cliente)
  cancel: async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },
};
