export enum UserRole {
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export class UserEntity {
  id: string;
  email: string;
  nif: string;
  name: string;
  password: string;
  credit: number;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    const { password, ...result } = this;
    return result;
  }
}
