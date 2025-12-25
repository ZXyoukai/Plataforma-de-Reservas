export enum UserRole {
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  nif: string;
  credit: number;
  role: UserRole | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginData {
  identifier: string; // email ou NIF
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  nif: string;
  role: UserRole;
}
