import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TokenData } from '../../users/dto/token-payload.dto';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(tokenPayload: TokenData) {
    const userId = parseInt(tokenPayload.sub);
    if (isNaN(userId)) {
      throw new UnauthorizedException(
        'Identificatorul utilizatorului din token este invalid.',
      );
    }
    const authenticatedUser = await this.authService.getUserByAccessToken(
      parseInt(tokenPayload.sub),
    );
    if (!authenticatedUser) {
      throw new UnauthorizedException();
    }
    return authenticatedUser;
  }
}
