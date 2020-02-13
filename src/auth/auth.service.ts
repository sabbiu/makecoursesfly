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
    const { name, username, password, photo, email } = authRegisterDto;

    const user = new this.userModel();
    user.name = name;
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    if (photo) user.photo = photo;

    try {
      await user.save();
    } catch (error) {
      this.handleRegistrationError(error);
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
      newUser.email = profile._json.email;
      newUser.photo = profile._json.picture;

      try {
        await newUser.save();
      } catch (error) {
        this.handleRegistrationError(error);
      }
      username = newUser.username;
    } else {
      username = user.username;
    }

    return this.generateToken({ username }).accessToken;
  }

  private handleRegistrationError(error: any) {
    const errorMessages = [];
    if (error && error.errors) {
      if (error.name === 'ValidationError') {
        for (let property in error.errors) {
          if (error.errors.hasOwnProperty(property)) {
            errorMessages.push({
              property,
              constraints: {
                duplicate: error.errors[property].properties.message,
              },
            });
          }
        }
        throw new ConflictException(errorMessages);
      }
    }
    throw new InternalServerErrorException();
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
