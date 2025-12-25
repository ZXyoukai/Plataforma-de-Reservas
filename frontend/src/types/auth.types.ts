export const UserRole = {
  CLIENT: 'CLIENT',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  nif: string;
  name: string;
  credit: number;
  role: UserRole | string; // Pode vir como string do backend
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
