import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRegistrationService } from './user-registration.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

@ApiTags('Usuários')
@Controller('user-registration')
export class UserRegistrationController {
  constructor(
    private readonly userRegistrationService: UserRegistrationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail ou NIF já cadastrado',
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    return this.userRegistrationService.registerUser(registerUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userRegistrationService.getUserById(id);
  }
}
