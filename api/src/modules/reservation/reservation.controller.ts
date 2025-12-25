import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,
  ): Promise<ReservationResponseDto> {
    return this.reservationService.create(createReservationDto, req.user.userId);
  }

  @Get('my-reservations')
  @Roles(UserRole.CLIENT)
  async findMyReservations(@Request() req): Promise<ReservationResponseDto[]> {
    return this.reservationService.findMyReservations(req.user.userId);
  }

  @Get('service-reservations')
  @Roles(UserRole.SERVICE_PROVIDER)
  async findServiceReservations(
    @Request() req,
  ): Promise<ReservationResponseDto[]> {
    return this.reservationService.findServiceReservations(req.user.userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ReservationResponseDto> {
    return this.reservationService.findById(id, req.user.userId);
  }

  @Put(':id/status')
  @Roles(UserRole.SERVICE_PROVIDER)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReservationStatusDto,
    @Request() req,
  ): Promise<ReservationResponseDto> {
    return this.reservationService.updateStatus(
      id,
      updateStatusDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(@Param('id') id: string, @Request() req): Promise<void> {
    return this.reservationService.cancel(id, req.user.userId);
  }
}
