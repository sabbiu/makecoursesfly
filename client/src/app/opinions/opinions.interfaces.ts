import { Pagination } from '../app.interfaces';
import { Opinion } from './opinion.model';

export interface OpinionCreate {
  text: string;
}

export interface PaginationOpinion extends Pagination {
  data: Opinion[];
}

export interface GetOpinionsFilter {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface OpinionUpdate {
  text: string;
}
