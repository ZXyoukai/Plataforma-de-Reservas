import { IsEnum } from 'class-validator';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus, {
    message: 'Status deve ser PENDING, CONFIRMED, CANCELLED ou COMPLETED',
  })
  status: ReservationStatus;
}
