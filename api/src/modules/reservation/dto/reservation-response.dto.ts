import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty({
    description: 'ID único da reserva',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário que fez a reserva',
    example: '507f1f77bcf86cd799439012',
  })
  userId: string;

  @ApiProperty({
    description: 'ID do serviço reservado',
    example: '507f1f77bcf86cd799439013',
  })
  serviceId: string;

  @ApiProperty({
    description: 'Nome do serviço reservado',
    example: 'Corte de Cabelo Masculino',
    required: false,
  })
  serviceName?: string;

  @ApiProperty({
    description: 'Descrição do serviço',
    example: 'Corte de cabelo masculino profissional',
    required: false,
  })
  serviceDescription?: string;

  @ApiProperty({
    description: 'Valor cobrado pela reserva',
    example: 50.00,
  })
  amount: number;

  @ApiProperty({
    description: 'Data e hora da reserva',
    example: '2024-01-20T14:30:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Status atual da reserva',
    example: 'CONFIRMED',
  })
  status: string;

  @ApiProperty({
    description: 'Data de criação da reserva',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João da Silva',
    required: false,
  })
  clientName?: string;

  @ApiProperty({
    description: 'Nome do prestador do serviço',
    example: 'Maria Barbeira',
    required: false,
  })
  providerName?: string;

  constructor(partial: Partial<ReservationResponseDto>) {
    Object.assign(this, partial);
  }
}
