import { Pagination } from '../../interfaces/pagination.interface';
import { PostDoc } from './post-document.interface';

export interface PostsPagination extends Pagination {
  data: PostDoc[];
}
