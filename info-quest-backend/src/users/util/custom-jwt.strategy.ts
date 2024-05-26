import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { SecurityConfig } from '../../config/config.interface';

@Injectable()
export class CustomJwtStrategy
  extends PassportStrategy(Strategy, 'custom-jwt')
  implements JwtOptionsFactory
{
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    return payload;
  }

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const expiresIn =
      this.configService.get<SecurityConfig>('security').expiresIn;

    return {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      signOptions: {
        expiresIn,
      },
    };
  }
}
