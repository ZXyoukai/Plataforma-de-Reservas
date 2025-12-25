import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaSegura@123',
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  password: string;
}
