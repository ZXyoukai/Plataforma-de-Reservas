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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@ApiTags('Reservas')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova reserva (apenas clientes)' })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada com sucesso. Saldo debitado atomicamente.',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Saldo insuficiente ou dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas clientes podem criar reservas',
  })
  @ApiResponse({
    status: 404,
    description: 'Serviço não encontrado',
  })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,
  ): Promise<ReservationResponseDto> {
    return this.reservationService.create(createReservationDto, req.user.userId);
  }

  @Get('my-reservations')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Listar minhas reservas (apenas clientes)' })
  @ApiResponse({
    status: 200,
    description: 'Lista das suas reservas',
    type: [ReservationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas clientes',
  })
  async findMyReservations(@Request() req): Promise<ReservationResponseDto[]> {
    return this.reservationService.findMyReservations(req.user.userId);
  }

  @Get('service-reservations')
  @Roles(UserRole.SERVICE_PROVIDER)
  @ApiOperation({ summary: 'Listar reservas dos meus serviços (apenas prestadores)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas dos seus serviços',
    type: [ReservationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas prestadores de serviço',
  })
  async findServiceReservations(
    @Request() req,
  ): Promise<ReservationResponseDto[]> {
    return this.reservationService.findServiceReservations(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para visualizar esta reserva',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada',
  })
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ReservationResponseDto> {
    return this.reservationService.findById(id, req.user.userId);
  }

  @Put(':id/status')
  @Roles(UserRole.SERVICE_PROVIDER)
  @ApiOperation({ summary: 'Atualizar status da reserva (apenas prestador do serviço)' })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com sucesso',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para atualizar esta reserva',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada',
  })
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
  @ApiOperation({ summary: 'Cancelar reserva (apenas o cliente que criou)' })
  @ApiResponse({
    status: 204,
    description: 'Reserva cancelada com sucesso. Saldo reembolsado atomicamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para cancelar esta reserva',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada',
  })
  async cancel(@Param('id') id: string, @Request() req): Promise<void> {
    return this.reservationService.cancel(id, req.user.userId);
  }
}
