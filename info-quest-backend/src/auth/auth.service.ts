import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserTokens } from '../users/dto/user-tokens.dto';
import { UserSecurityService } from '../users/user-security.service';
import { Auth, google } from 'googleapis';

@Injectable()
export class AuthService {
  private readonly googleOAuth2Client: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly userSecurityService: UserSecurityService,
  ) {
    this.googleOAuth2Client = this.initializeGoogleOAuth2Client();
  }

  private initializeGoogleOAuth2Client(): Auth.OAuth2Client {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    return new google.auth.OAuth2(googleClientId, googleClientSecret);
  }

  async createOrUpdateGoogleUser(userInfo: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    // const existingUser = await this.usersService.findOneByEmail(userInfo.email);
    // if (existingUser) {
    //   return existingUser;
    // }
    const existingUser = await this.usersService.findOneByEmail(userInfo.email);
    if (existingUser && !existingUser.deletedAt) {
      return existingUser;
    } else if (existingUser && existingUser.deletedAt) {
      throw new Error('Account is deactivated.');
    }
    const fullName = `${userInfo.firstName} ${userInfo.lastName}`;

    const adminUserEmail = process.env.ADMIN_USER_EMAIL.toLowerCase();
    let roleId = 3;
    if (userInfo.email.toLowerCase() === adminUserEmail) {
      roleId = 1;
    }

    return this.usersService.create({
      email: userInfo.email,
      name: fullName,
      roleId: roleId,
    });
  }

  async login(userId: number): Promise<UserTokens> {
    const user = await this.usersService.findOne(userId);
    if (!user || user.deletedAt) {
      throw new Error('User not found or is deactivated.');
    }
    const tokens = this.userSecurityService.generateTokens({
      sub: userId.toString(),
    });
    const hashedRefreshToken = await this.userSecurityService.hashSecret(
      tokens.refreshToken,
    );
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
    return tokens;
  }

  async getUserByAccessToken(userId: number): Promise<Partial<User>> {
    const user = await this.usersService.findOneWithOptions(
      { id: userId },
      { relations: ['role'] },
    );
    return user && !!user.refreshToken ? user : null;
  }
}
