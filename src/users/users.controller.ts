import {
  Controller,
  Get,
  UseGuards,
  ValidationPipe,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { UserProfile } from './interfaces/user-profile.interface';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UsersPagination } from './interfaces/users-pagination.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @UseGuards(AuthGuard())
  me(@GetUser() user: UserDoc): UserProfile {
    const { _id, username, name, photo, email } = user;
    return { _id, username, name, photo, email };
  }

  @Get('')
  getUsers(
    @Query(new ValidationPipe({ transform: true })) filterDto: GetUsersFilterDto
  ): Promise<UsersPagination> {
    return this.usersService.getUsers(filterDto);
  }

  @Get(':username')
  getUser(@Param('username') username: string): Promise<UserDoc> {
    return this.usersService.getUser(username);
  }
}
