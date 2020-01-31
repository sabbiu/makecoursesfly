import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import * as config from 'config';
import { AuthService } from './auth.service';

const googleConfig = config.get('google');

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || googleConfig.clientId,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      passReqToCallback: true,
      scope: ['profile'],
    });
  }

  async validate(
    _request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any
  ) {
    try {
      const accessToken: string = await this.authService.validateOAuthGoogleLogin(
        profile
      );
      done(null, { accessToken });
    } catch (err) {
      done(err, false);
    }
  }
}
