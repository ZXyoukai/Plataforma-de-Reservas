import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get databaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '24h';
  }

  get port(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }
}
