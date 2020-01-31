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
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
