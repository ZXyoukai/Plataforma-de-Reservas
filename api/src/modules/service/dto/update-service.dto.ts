import { IsString, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'O nome do serviço deve ter no máximo 100 caracteres' })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @IsOptional()
  @Min(0, { message: 'O preço deve ser maior ou igual a 0' })
  price?: number;
}
