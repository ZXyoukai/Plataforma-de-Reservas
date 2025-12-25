import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({
    description: 'ID único do serviço',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Corte de Cabelo Masculino',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição do serviço',
    example: 'Corte de cabelo masculino profissional com acabamento e styling',
  })
  description: string;

  @ApiProperty({
    description: 'Preço do serviço',
    example: 50.00,
  })
  price: number;

  @ApiProperty({
    description: 'ID do prestador do serviço',
    example: '507f1f77bcf86cd799439012',
  })
  providerId: string;

  @ApiProperty({
    description: 'Nome do prestador do serviço',
    example: 'Maria Barbeira',
    required: false,
  })
  providerName?: string;

  @ApiProperty({
    description: 'Data de criação do serviço',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<ServiceResponseDto>) {
    Object.assign(this, partial);
  }
}
