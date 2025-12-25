export const ReservationStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

export interface Reservation {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationData {
  serviceId: string;
  date: string; // Data em formato ISO 8601
}

export interface UpdateReservationStatusData {
  status: ReservationStatus;
}
