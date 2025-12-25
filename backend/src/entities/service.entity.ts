export class ServiceEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ServiceEntity>) {
    Object.assign(this, partial);
  }
}
