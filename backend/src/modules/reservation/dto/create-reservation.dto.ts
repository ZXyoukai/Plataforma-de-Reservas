import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'ID do serviço a ser reservado',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório' })
  serviceId: string;

  @ApiProperty({
    description: 'Data e hora da reserva (formato ISO 8601)',
    example: '2024-01-20T14:30:00.000Z',
  })
  @IsDateString({}, { message: 'A data deve ser válida' })
  @IsNotEmpty({ message: 'A data da reserva é obrigatória' })
  date: string;
}
