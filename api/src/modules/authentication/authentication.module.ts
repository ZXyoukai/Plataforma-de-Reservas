import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../../repositories/user.repository';
import { BcryptPasswordHasher } from '../../providers/bcrypt-password-hasher.provider';
import { JwtTokenGenerator } from '../../providers/jwt-token-generator.provider';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    UserRepository,
    BcryptPasswordHasher,
    JwtTokenGenerator,
  ],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
