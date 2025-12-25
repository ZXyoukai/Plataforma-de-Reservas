import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByNif(nif: string): Promise<UserEntity | null>;
  update(id: string, data: UpdateUserData): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}

export interface CreateUserData {
  email: string;
  nif: string;
  name: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  credit?: number;
}
