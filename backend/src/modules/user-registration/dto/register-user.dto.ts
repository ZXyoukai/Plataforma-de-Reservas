import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../entities/user.entity';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Número de Identificação Fiscal (NIF)',
    example: '12345678901',
  })
  @IsNotEmpty({ message: 'O NIF é obrigatório' })
  @IsString({ message: 'O NIF deve ser uma string' })
  nif: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres)',
    example: 'SenhaSegura@123',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Tipo de usuário na plataforma',
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  @IsEnum(UserRole, { message: 'Tipo de usuário inválido' })
  role: UserRole;
}
