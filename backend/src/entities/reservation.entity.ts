export class ReservationEntity {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ReservationEntity>) {
    Object.assign(this, partial);
  }
}
