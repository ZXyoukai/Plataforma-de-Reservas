import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class UpdateReservationStatusDto {
  @ApiProperty({
    description: 'Novo status da reserva',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @IsEnum(ReservationStatus, {
    message: 'Status deve ser PENDING, CONFIRMED, CANCELLED ou COMPLETED',
  })
  status: ReservationStatus;
}
