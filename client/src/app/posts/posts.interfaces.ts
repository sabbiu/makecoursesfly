import { Post } from './post.model';
import { Pagination } from '../app.interfaces';

export interface PostCreate {
  title: string;
  url: string;
  tagsOld?: string[];
  tagsNew?: string[];
}

export interface UrlMetadata {
  url: string;
  title: string;
  image: string;
  description: string;
}

export interface PostWithUrlMetadata {
  post: Post;
  urlMetadata: UrlMetadata;
}

export interface GetPostsFilter {
  offset?: number;
  limit?: number;
  tags?: string[];
}

export interface PaginationPost extends Pagination {
  data: Post[];
}
