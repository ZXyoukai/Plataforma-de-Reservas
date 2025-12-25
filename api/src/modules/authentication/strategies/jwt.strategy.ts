import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationService } from '../authentication.service';
import { TokenPayload } from '../../../interfaces/token-generator.interface';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.authenticationService.validateUser(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não autorizado');
    }

    return user;
  }
}
