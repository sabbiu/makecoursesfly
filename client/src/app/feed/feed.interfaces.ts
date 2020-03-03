import { Opinion } from '../opinions/opinion.model';
import { Post } from '../posts/post.model';
import { Pagination } from '../app.interfaces';

export interface Feed extends Opinion {
  post: Post;
}

export interface GetFeedFilter {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface PaginationFeed extends Pagination {
  data: Feed[];
}
