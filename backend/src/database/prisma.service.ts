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
      this.logger.log('✅ Prisma Client conectado ao PostgreSQL');
    } catch (error) {
      this.logger.error('Erro ao conectar ao PostgreSQL:', error.message);
      this.logger.warn('A aplicação continuará, mas as operações de banco de dados falharão');
      this.logger.warn('Verifique:');
      this.logger.warn('   1. Se o PostgreSQL está acessível');
      this.logger.warn('   2. Se a DATABASE_URL no .env está correta');
      this.logger.warn('   3. Se as credenciais de acesso estão corretas');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma Client desconectado do PostgreSQL');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Não é possível limpar o banco de dados em produção!');
    }

    await this.reservation.deleteMany();
    await this.service.deleteMany();
    await this.user.deleteMany();
    
    console.log('Banco de dados limpo');
  }
}
