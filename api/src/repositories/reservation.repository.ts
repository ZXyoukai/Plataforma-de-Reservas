import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReservationEntity } from '../entities/reservation.entity';

export interface CreateReservationData {
  userId: string;
  serviceId: string;
  date: Date;
  amount: number;
}

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReservationData): Promise<ReservationEntity> {
    const reservation = await this.prisma.reservation.create({
      data: {
        userId: data.userId,
        serviceId: data.serviceId,
        date: data.date,
        amount: data.amount,
        status: 'PENDING',
      },
    });

    return new ReservationEntity(reservation);
  }

  async findById(id: string): Promise<any> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return reservation;
  }

  async findByUserId(userId: string): Promise<any[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }

  async findByProviderId(providerId: string): Promise<any[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        service: {
          providerId: providerId,
        },
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }

  async updateStatus(id: string, status: string): Promise<ReservationEntity> {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: { status: status as any },
    });

    return new ReservationEntity(reservation);
  }

  async cancel(id: string): Promise<ReservationEntity> {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' as any },
    });

    return new ReservationEntity(reservation);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.reservation.count({
      where: { id },
    });
    return count > 0;
  }
}
