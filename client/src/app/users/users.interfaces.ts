import { Pagination } from '../app.interfaces';
import { User } from '../auth/user.model';

export interface GetUsersFilter {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface PaginationUser extends Pagination {
  data: User[];
}
