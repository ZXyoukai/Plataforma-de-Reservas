import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { BcryptPasswordHasher } from '../../providers/bcrypt-password-hasher.provider';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserRegistrationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
  ) {}

  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    // Validar se o e-mail já existe
    const existingUserByEmail = await this.userRepository.findByEmail(
      registerUserDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException('E-mail já cadastrado no sistema');
    }

    // Validar se o NIF já existe
    const existingUserByNif = await this.userRepository.findByNif(
      registerUserDto.nif,
    );
    if (existingUserByNif) {
      throw new ConflictException('NIF já cadastrado no sistema');
    }

    // Criptografar senha
    const hashedPassword = await this.passwordHasher.hash(
      registerUserDto.password,
    );

    // Criar usuário
    const user = await this.userRepository.create({
      email: registerUserDto.email,
      nif: registerUserDto.nif,
      name: registerUserDto.name,
      password: hashedPassword,
      role: registerUserDto.role,
    });

    // Retornar resposta sem a senha
    return new UserResponseDto({
      id: user.id,
      email: user.email,
      nif: user.nif,
      name: user.name,
      credit: user.credit,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return new UserResponseDto({
      id: user.id,
      email: user.email,
      nif: user.nif,
      name: user.name,
      credit: user.credit,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
