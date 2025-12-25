export class ReservationResponseDto {
  id: string;
  userId: string;
  serviceId: string;
  serviceName?: string;
  serviceDescription?: string;
  amount: number;
  date: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  clientName?: string;
  providerName?: string;

  constructor(partial: Partial<ReservationResponseDto>) {
    Object.assign(this, partial);
  }
}
