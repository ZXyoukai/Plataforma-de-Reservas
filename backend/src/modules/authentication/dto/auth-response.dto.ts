import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user-registration/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
