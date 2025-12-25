import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../entities/user.entity';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @IsNotEmpty({ message: 'O NIF é obrigatório' })
  @IsString({ message: 'O NIF deve ser uma string' })
  nif: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  @IsEnum(UserRole, { message: 'Tipo de usuário inválido' })
  role: UserRole;
}
