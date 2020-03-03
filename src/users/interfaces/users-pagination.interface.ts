import { Pagination } from '../../interfaces/pagination.interface';
import { User } from './user.interface';

export interface UsersPagination extends Pagination {
  data: User[];
}
