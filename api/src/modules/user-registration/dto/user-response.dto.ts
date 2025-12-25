import { UserRole } from '../../../entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  nif: string;
  name: string;
  credit: number;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
