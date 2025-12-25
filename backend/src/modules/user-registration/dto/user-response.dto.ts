import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Número de Identificação Fiscal (NIF)',
    example: '12345678901',
  })
  nif: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Crédito disponível do usuário',
    example: 1000.00,
  })
  credit: number;

  @ApiProperty({
    description: 'Tipo de usuário na plataforma',
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
