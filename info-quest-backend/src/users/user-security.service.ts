import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '../config/config.interface';
import { TokenData } from './dto/token-payload.dto';
import { UserTokens } from './dto/user-tokens.dto';

@Injectable()
export class UserSecurityService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  hashSecret(password: string): Promise<string> {
    return hash(password);
  }

  generateTokens(payload: TokenData): UserTokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
  private generateAccessToken(payload: TokenData): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: TokenData): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }
}
