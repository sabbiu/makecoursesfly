import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async register(authRegisterDto: AuthRegisterDto): Promise<void> {
    const { name, username, password } = authRegisterDto;

    const user = new this.userModel();
    user.name = name;
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === MONGO_ERROR_CODE.DUPLICATE) {
        throw new ConflictException('Username Already Exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async login(authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    const { username, password } = authLoginDto;
    const user = await this.userModel.findOne({ username });

    if (!(user && (await user.validatePassword(password)))) {
      return null;
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
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

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async validateUsername(username: string): Promise<string> {
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
}
