import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from '../../repositories/reservation.repository';
import { ServiceRepository } from '../../repositories/service.repository';
import { UserRepository } from '../../repositories/user.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    ReservationRepository,
    ServiceRepository,
    UserRepository,
  ],
  exports: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
