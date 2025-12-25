import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ReservationRepository } from '../../repositories/reservation.repository';
import { ServiceRepository } from '../../repositories/service.repository';
import { UserRepository } from '../../repositories/user.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    userId: string,
  ): Promise<ReservationResponseDto> {
    // 1. Verificar se o serviço existe
    const service = await this.serviceRepository.findById(
      createReservationDto.serviceId,
    );

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // 2. Verificar se o cliente não está tentando reservar seu próprio serviço
    if (service.providerId === userId) {
      throw new BadRequestException(
        'Você não pode reservar seu próprio serviço',
      );
    }

    // 3. Buscar o cliente e verificar saldo
    const client = await this.userRepository.findById(userId);
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (client.credit < service.price) {
      throw new BadRequestException(
        `Saldo insuficiente. Você tem ${client.credit.toFixed(2)} e o serviço custa ${service.price.toFixed(2)}`,
      );
    }

    // 4. Buscar o provedor
    const provider = await this.userRepository.findById(service.providerId);
    if (!provider) {
      throw new NotFoundException('Provedor não encontrado');
    }

    // 5. Criar a reserva e atualizar saldos em uma transação
    const reservation = await this.prisma.$transaction(async (tx) => {
      // Debitar do cliente
      await tx.user.update({
        where: { id: userId },
        data: { credit: client.credit - service.price },
      });

      // Creditar ao provedor
      await tx.user.update({
        where: { id: service.providerId },
        data: { credit: provider.credit + service.price },
      });

      // Criar a reserva
      const newReservation = await tx.reservation.create({
        data: {
          userId: userId,
          serviceId: createReservationDto.serviceId,
          date: new Date(createReservationDto.date),
          amount: service.price,
          status: 'CONFIRMED',
        },
        include: {
          service: true,
        },
      });

      return newReservation;
    });

    return new ReservationResponseDto({
      id: reservation.id,
      userId: reservation.userId,
      serviceId: reservation.serviceId,
      serviceName: reservation.service.name,
      serviceDescription: reservation.service.description,
      amount: reservation.amount,
      date: reservation.date,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    });
  }

  async findMyReservations(userId: string): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationRepository.findByUserId(userId);

    return reservations.map(
      (reservation) =>
        new ReservationResponseDto({
          id: reservation.id,
          userId: reservation.userId,
          serviceId: reservation.serviceId,
          serviceName: reservation.service.name,
          serviceDescription: reservation.service.description,
          amount: reservation.amount,
          date: reservation.date,
          status: reservation.status,
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt,
          providerName: reservation.service.provider.name,
        }),
    );
  }

  async findServiceReservations(
    providerId: string,
  ): Promise<ReservationResponseDto[]> {
    const reservations =
      await this.reservationRepository.findByProviderId(providerId);

    return reservations.map(
      (reservation) =>
        new ReservationResponseDto({
          id: reservation.id,
          userId: reservation.userId,
          serviceId: reservation.serviceId,
          serviceName: reservation.service.name,
          serviceDescription: reservation.service.description,
          amount: reservation.amount,
          date: reservation.date,
          status: reservation.status,
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt,
          clientName: reservation.user.name,
        }),
    );
  }

  async findById(id: string, userId: string): Promise<ReservationResponseDto> {
    const reservation = await this.reservationRepository.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Verificar se o usuário tem permissão para ver a reserva
    const isClient = reservation.userId === userId;
    const isProvider = reservation.service.provider.id === userId;

    if (!isClient && !isProvider) {
      throw new ForbiddenException(
        'Você não tem permissão para visualizar esta reserva',
      );
    }

    return new ReservationResponseDto({
      id: reservation.id,
      userId: reservation.userId,
      serviceId: reservation.serviceId,
      serviceName: reservation.service.name,
      serviceDescription: reservation.service.description,
      amount: reservation.amount,
      date: reservation.date,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      clientName: reservation.user.name,
      providerName: reservation.service.provider.name,
    });
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateReservationStatusDto,
    userId: string,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.reservationRepository.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Apenas o provedor pode atualizar o status
    if (reservation.service.provider.id !== userId) {
      throw new ForbiddenException(
        'Apenas o provedor pode atualizar o status da reserva',
      );
    }

    const updated = await this.reservationRepository.updateStatus(
      id,
      updateStatusDto.status,
    );

    return new ReservationResponseDto({
      id: updated.id,
      userId: updated.userId,
      serviceId: updated.serviceId,
      amount: updated.amount,
      date: updated.date,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async cancel(id: string, userId: string): Promise<void> {
    const reservation = await this.reservationRepository.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Apenas o cliente pode cancelar
    if (reservation.userId !== userId) {
      throw new ForbiddenException(
        'Apenas o cliente pode cancelar a reserva',
      );
    }

    // Não pode cancelar se já estiver cancelada ou completada
    if (
      reservation.status === 'CANCELLED' ||
      reservation.status === 'COMPLETED'
    ) {
      throw new BadRequestException(
        `Não é possível cancelar uma reserva com status ${reservation.status}`,
      );
    }

    // Cancelar e devolver o dinheiro ao cliente
    await this.prisma.$transaction(async (tx) => {
      // Creditar de volta ao cliente
      const client = await tx.user.findUnique({ where: { id: userId } });
      await tx.user.update({
        where: { id: userId },
        data: { credit: (client?.credit || 0) + reservation.amount },
      });

      // Debitar do provedor
      const provider = await tx.user.findUnique({
        where: { id: reservation.service.provider.id },
      });
      await tx.user.update({
        where: { id: reservation.service.provider.id },
        data: { credit: (provider?.credit || 0) - reservation.amount },
      });

      // Atualizar status da reserva
      await tx.reservation.update({
        where: { id },
        data: { status: 'CANCELLED' as any },
      });
    });
  }
}
