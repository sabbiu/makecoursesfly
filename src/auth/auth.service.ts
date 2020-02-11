import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MONGO_ERROR_CODE } from 'config/error-codes.constant';
import { User } from './interfaces/user.interface';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { randomNumber } from '../helpers/randomNumber';
import { Token } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(authRegisterDto: AuthRegisterDto): Promise<Token> {
    const { name, username, password, photo } = authRegisterDto;

    const user = new this.userModel();
    user.name = name;
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    if (photo) user.photo = photo;

    try {
      await user.save();
    } catch (error) {
      if (error.code === MONGO_ERROR_CODE.DUPLICATE) {
        throw new ConflictException([
          {
            property: 'username',
            constraints: {
              duplicate: 'Username already exists',
            },
          },
        ]);
      }
      throw new InternalServerErrorException();
    }

    return this.generateToken({ username });
  }

  async login(authLoginDto: AuthLoginDto): Promise<Token> {
    const { username, password } = authLoginDto;
    const user = await this.userModel.findOne({ username });

    if (!(user && (await user.validatePassword(password)))) {
      throw new UnauthorizedException();
    }

    return this.generateToken({ username });
  }

  async validateOAuthGoogleLogin(profile: any): Promise<string> {
    const user = await this.userModel.findOne({ googleId: profile.id });
    let username: string;
    if (!user) {
      const newUser = new this.userModel();
      newUser.googleId = profile.id;
      newUser.name = profile._json.name;
      newUser.username = await this.validateUsername(
        profile._json.given_name.toLowerCase()
      );
      newUser.photo = profile._json.picture;

      await newUser.save();
      username = newUser.username;
    } else {
      username = user.username;
    }

    return this.generateToken({ username }).accessToken;
  }

  private async validateUsername(username: string): Promise<string> {
    let newUsername = username;
    while (true) {
      const user = await this.userModel.findOne({ username: newUsername });
      if (user) {
        newUsername = `${username}${randomNumber(300)}`;
      } else {
        break;
      }
    }
    return newUsername;
  }

  private generateToken(payload: JwtPayload): Token {
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
