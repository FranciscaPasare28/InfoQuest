import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: any,
  //   done: VerifyCallback,
  // ): Promise<void> {
  //   try {
  //     const { emails, name } = profile;
  //     if (!emails) {
  //       throw new Error('No email found in Google profile');
  //     }
  //
  //     const googleUser = {
  //       email: emails[0].value,
  //       firstName: name?.givenName,
  //       lastName: name?.familyName,
  //     };
  //
  //     const user = await this.authService.createOrUpdateGoogleUser(googleUser);
  //     done(null, user);
  //   } catch (error) {
  //     done(error);
  //   }
  // }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const googleUser = this.extractUserFromProfile(profile);
      const user = await this.findOrCreateUser(googleUser);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }

  private extractUserFromProfile(profile: Profile) {
    if (!profile.emails || profile.emails.length === 0) {
      throw new Error('No email found in Google profile');
    }

    return {
      email: profile.emails[0].value,
      firstName: profile.name?.givenName ?? 'Unknown',
      lastName: profile.name?.familyName ?? 'Unknown',
    };
  }

  private async findOrCreateUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    return this.authService.createOrUpdateGoogleUser(googleUser);
  }
}
