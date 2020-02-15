import { Pagination } from '../../interfaces/pagination.interface';
import { TagDoc } from './tag-document.interfact';

export interface TagsPagination extends Pagination {
  data: TagDoc[];
}
