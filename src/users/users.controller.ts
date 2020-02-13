import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/interfaces/user.interface';
import { UserProfile } from './interfaces/user-profile.interface';

@Controller('users')
export class UsersController {
  @Get('/me')
  @UseGuards(AuthGuard())
  me(@GetUser() user: User): UserProfile {
    const { _id, username, name, photo, email } = user;
    return { id: _id, username, name, photo, email };
  }
}
