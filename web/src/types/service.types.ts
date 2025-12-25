export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  providerId: string;
  providerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceData {
  name: string;
  description: string;
  price: number;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
}
