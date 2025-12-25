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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(UserRole.SERVICE_PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Request() req,
  ): Promise<ServiceResponseDto> {
    return this.serviceService.create(createServiceDto, req.user.userId);
  }

  @Get()
  async findAll(): Promise<ServiceResponseDto[]> {
    return this.serviceService.findAll();
  }

  @Get('my-services')
  @Roles(UserRole.SERVICE_PROVIDER)
  async findMyServices(@Request() req): Promise<ServiceResponseDto[]> {
    return this.serviceService.findByProvider(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.serviceService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SERVICE_PROVIDER)
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req,
  ): Promise<ServiceResponseDto> {
    return this.serviceService.update(id, updateServiceDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.SERVICE_PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    return this.serviceService.delete(id, req.user.userId);
  }
}
