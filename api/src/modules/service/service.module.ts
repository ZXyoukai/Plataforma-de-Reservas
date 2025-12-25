import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { ServiceRepository } from '../../repositories/service.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository],
  exports: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
