import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório' })
  serviceId: string;

  @IsDateString({}, { message: 'A data deve ser válida' })
  @IsNotEmpty({ message: 'A data da reserva é obrigatória' })
  date: string;
}
