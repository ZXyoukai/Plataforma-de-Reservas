import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserEntity } from '../entities/user.entity';
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

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

    return new UserEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? new UserEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? new UserEntity(user) : null;
  }

  async findByNif(nif: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { nif },
    });

    return user ? new UserEntity(user) : null;
  }

  async update(id: string, data: UpdateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return new UserEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
