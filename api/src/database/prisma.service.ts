import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      accelerateUrl: process.env.DATABASE_URL || '',
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma Client conectado ao MongoDB');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma Client desconectado do MongoDB');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Não é possível limpar o banco de dados em produção!');
    }

    await this.user.deleteMany();
    await this.service.deleteMany();
    
    console.log('Banco de dados limpo');
  }
}
