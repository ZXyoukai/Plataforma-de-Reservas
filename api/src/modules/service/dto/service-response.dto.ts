export class ServiceResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  providerId: string;
  providerName?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ServiceResponseDto>) {
    Object.assign(this, partial);
  }
}
