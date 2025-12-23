import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ManageModule } from './manage/manage.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [AuthModule, ManageModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
