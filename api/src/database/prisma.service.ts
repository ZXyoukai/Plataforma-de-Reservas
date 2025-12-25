import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma Client conectado ao MongoDB');
    } catch (error) {
      this.logger.error('Erro ao conectar ao MongoDB:', error.message);
      this.logger.warn('A aplicação continuará, mas as operações de banco de dados falharão');
      this.logger.warn('Verifique:');
      this.logger.warn('   1. Se o MongoDB Atlas está acessível');
      this.logger.warn('   2. Se a senha no DATABASE_URL está correta');
      this.logger.warn('   3. Se seu IP está na whitelist do MongoDB Atlas');
    }
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
