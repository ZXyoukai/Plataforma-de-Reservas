import { IsString, IsNotEmpty, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório' })
  @MaxLength(100, { message: 'O nome do serviço deve ter no máximo 100 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do serviço é obrigatória' })
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description: string;

  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @Min(0, { message: 'O preço deve ser maior ou igual a 0' })
  price: number;
}
