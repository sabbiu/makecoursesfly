import { Pagination } from '../../interfaces/pagination.interface';
import { Tag } from './tag.interface';

export interface TagsPagination extends Pagination {
  data: Tag[];
}
