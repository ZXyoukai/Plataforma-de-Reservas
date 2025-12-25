import { IsString, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Corte de Cabelo Premium',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'O nome do serviço deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Descrição detalhada do serviço',
    example: 'Corte de cabelo premium com tratamento capilar incluído',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Preço do serviço',
    example: 75.00,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @IsOptional()
  @Min(0, { message: 'O preço deve ser maior ou igual a 0' })
  price?: number;
}
