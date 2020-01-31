import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Model } from 'mongoose';
import * as config from 'config';
import { User } from './interfaces/user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY || config.get('jwt').secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
