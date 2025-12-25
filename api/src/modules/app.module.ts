import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../database/prisma.module';
import { UserRegistrationModule } from './user-registration/user-registration.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ManageModule } from './manage/manage.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UserRegistrationModule,
    AuthenticationModule,
    ManageModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
