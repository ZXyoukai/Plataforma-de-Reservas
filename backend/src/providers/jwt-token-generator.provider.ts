import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ITokenGenerator,
  TokenPayload,
} from '../interfaces/token-generator.interface';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
