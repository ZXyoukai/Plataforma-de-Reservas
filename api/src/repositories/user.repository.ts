import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserEntity, UserRole } from '../entities/user.entity';
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToUserEntity(user: any): UserEntity {
    return new UserEntity({
      ...user,
      role: user.role as UserRole,
    });
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        nif: data.nif,
        name: data.name,
        password: data.password,
        role: data.role as any,
      },
    });

    return this.mapToUserEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToUserEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToUserEntity(user) : null;
  }

  async findByNif(nif: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { nif },
    });

    return user ? this.mapToUserEntity(user) : null;
  }

  async update(id: string, data: UpdateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.mapToUserEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
