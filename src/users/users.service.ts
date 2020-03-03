import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UsersPagination } from './interfaces/users-pagination.interface';
import { UserDoc } from '../auth/interfaces/user-document.interface';

@Injectable()
export class UsersService {
  constructor(private authService: AuthService) {}

  getUsers(filterDto: GetUsersFilterDto): Promise<UsersPagination> {
    return this.authService.getUsers(filterDto);
  }

  getUser(username: string): Promise<UserDoc> {
    return this.authService.getUser(username);
  }
}
