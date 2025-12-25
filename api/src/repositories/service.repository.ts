import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ServiceEntity } from '../entities/service.entity';

export interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  providerId: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
}

@Injectable()
export class ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateServiceData): Promise<ServiceEntity> {
    const service = await this.prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        providerId: data.providerId,
      },
    });

    return new ServiceEntity(service);
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return service ? new ServiceEntity(service) : null;
  }

  async findByProviderId(providerId: string): Promise<ServiceEntity[]> {
    const services = await this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });

    return services.map((service) => new ServiceEntity(service));
  }

  async findAll(): Promise<ServiceEntity[]> {
    const services = await this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return services.map((service) => new ServiceEntity(service));
  }

  async update(id: string, data: UpdateServiceData): Promise<ServiceEntity> {
    const service = await this.prisma.service.update({
      where: { id },
      data,
    });

    return new ServiceEntity(service);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.service.count({
      where: { id },
    });
    return count > 0;
  }
}
