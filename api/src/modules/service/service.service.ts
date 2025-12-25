import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ServiceRepository } from '../../repositories/service.repository';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async create(
    createServiceDto: CreateServiceDto,
    providerId: string,
  ): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.create({
      ...createServiceDto,
      providerId,
    });

    return new ServiceResponseDto({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      providerId: service.providerId,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    });
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.findAll();

    return services.map(
      (service) =>
        new ServiceResponseDto({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          providerId: service.providerId,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        }),
    );
  }

  async findById(id: string): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return new ServiceResponseDto({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      providerId: service.providerId,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    });
  }

  async findByProvider(providerId: string): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.findByProviderId(providerId);

    return services.map(
      (service) =>
        new ServiceResponseDto({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          providerId: service.providerId,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        }),
    );
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    userId: string,
  ): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Verificar se o usuário é o provedor do serviço
    if (service.providerId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este serviço',
      );
    }

    const updatedService = await this.serviceRepository.update(
      id,
      updateServiceDto,
    );

    return new ServiceResponseDto({
      id: updatedService.id,
      name: updatedService.name,
      description: updatedService.description,
      price: updatedService.price,
      providerId: updatedService.providerId,
      createdAt: updatedService.createdAt,
      updatedAt: updatedService.updatedAt,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Verificar se o usuário é o provedor do serviço
    if (service.providerId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este serviço',
      );
    }

    await this.serviceRepository.delete(id);
  }
}
