import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../../repositories/user.repository';
import { BcryptPasswordHasher } from '../../providers/bcrypt-password-hasher.provider';
import { JwtTokenGenerator } from '../../providers/jwt-token-generator.provider';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: configService.jwtExpiresIn as any },
      }),
      inject: [ConfigService],
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
