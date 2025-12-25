import { Module } from '@nestjs/common';
import { UserRegistrationController } from './user-registration.controller';
import { UserRegistrationService } from './user-registration.service';
import { UserRepository } from '../../repositories/user.repository';
import { BcryptPasswordHasher } from '../../providers/bcrypt-password-hasher.provider';

@Module({
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService, UserRepository, BcryptPasswordHasher],
  exports: [UserRepository],
})
export class UserRegistrationModule {}
