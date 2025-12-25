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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';

@ApiTags('Serviços')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(UserRole.SERVICE_PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo serviço (apenas prestadores)' })
  @ApiResponse({
    status: 201,
    description: 'Serviço criado com sucesso',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas prestadores de serviço podem criar serviços',
  })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Request() req,
  ): Promise<ServiceResponseDto> {
    return this.serviceService.create(createServiceDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os serviços disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de serviços',
    type: [ServiceResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async findAll(): Promise<ServiceResponseDto[]> {
    return this.serviceService.findAll();
  }

  @Get('my-services')
  @Roles(UserRole.SERVICE_PROVIDER)
  @ApiOperation({ summary: 'Listar meus serviços (apenas prestadores)' })
  @ApiResponse({
    status: 200,
    description: 'Lista dos seus serviços',
    type: [ServiceResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas prestadores de serviço',
  })
  async findMyServices(@Request() req): Promise<ServiceResponseDto[]> {
    return this.serviceService.findByProvider(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  @ApiResponse({
    status: 200,
    description: 'Serviço encontrado',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Serviço não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.serviceService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SERVICE_PROVIDER)
  @ApiOperation({ summary: 'Atualizar serviço (apenas o dono)' })
  @ApiResponse({
    status: 200,
    description: 'Serviço atualizado com sucesso',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para atualizar este serviço',
  })
  @ApiResponse({
    status: 404,
    description: 'Serviço não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req,
  ): Promise<ServiceResponseDto> {
    return this.serviceService.update(id, updateServiceDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SERVICE_PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar serviço (apenas o dono)' })
  @ApiResponse({
    status: 204,
    description: 'Serviço deletado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para deletar este serviço',
  })
  @ApiResponse({
    status: 404,
    description: 'Serviço não encontrado',
  })
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    return this.serviceService.delete(id, req.user.id);
  }
}
