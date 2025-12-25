export enum UserRole {
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export interface User {
  id: string;
  email: string;
  nif: string;
  name: string;
  credit: number;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  identifier: string; // pode ser email ou NIF
  password: string;
}

export interface RegisterData {
  name: string;
  nif: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
