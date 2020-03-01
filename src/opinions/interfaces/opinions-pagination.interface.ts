import { Pagination } from '../../interfaces/pagination.interface';
import { OpinionDoc } from './opinion-document.interface';

export interface OpinionsPagination extends Pagination {
  data: OpinionDoc[];
}
