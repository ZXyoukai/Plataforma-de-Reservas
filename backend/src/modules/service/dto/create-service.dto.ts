import { IsString, IsNotEmpty, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Corte de Cabelo Masculino',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório' })
  @MaxLength(100, { message: 'O nome do serviço deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do serviço',
    example: 'Corte de cabelo masculino profissional com acabamento e styling',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição do serviço é obrigatória' })
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Preço do serviço',
    example: 50.00,
    minimum: 0,
  })
  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @Min(0, { message: 'O preço deve ser maior ou igual a 0' })
  price: number;
}
