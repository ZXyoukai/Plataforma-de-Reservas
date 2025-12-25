import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { BcryptPasswordHasher } from '../../providers/bcrypt-password-hasher.provider';
import { JwtTokenGenerator } from '../../providers/jwt-token-generator.provider';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../user-registration/dto/user-response.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
    private readonly tokenGenerator: JwtTokenGenerator,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Buscar usuário por e-mail
    const user = await this.userRepository.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await this.passwordHasher.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = await this.tokenGenerator.generate({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Retornar resposta com token e dados do usuário
    return new AuthResponseDto({
      accessToken: token,
      user: new UserResponseDto({
        id: user.id,
        email: user.email,
        nif: user.nif,
        name: user.name,
        credit: user.credit,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }),
    });
  }

  async validateUser(userId: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return null;
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
