import { UserResponseDto } from '../../user-registration/dto/user-response.dto';

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
