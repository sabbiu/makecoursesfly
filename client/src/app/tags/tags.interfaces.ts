import { Pagination } from '../app.interfaces';

export interface TagWithAnalytics {
  _id: string;
  title: string;
  createdAt: string;
  postsCount: number;
}

export interface GetTagsFilter {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface PaginationTag extends Pagination {
  data: TagWithAnalytics[];
}
