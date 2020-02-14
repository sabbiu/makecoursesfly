import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { UserProfile } from './interfaces/user-profile.interface';

@Controller('users')
export class UsersController {
  @Get('/me')
  @UseGuards(AuthGuard())
  me(@GetUser() user: UserDoc): UserProfile {
    const { _id, username, name, photo, email } = user;
    return { id: _id, username, name, photo, email };
  }
}
