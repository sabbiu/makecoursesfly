import { Action } from '@ngrx/store';
import { Post } from '../post.model';
import {
  PostCreate,
  UrlMetadata,
  GetPostsFilter,
  PaginationPost,
} from '../posts.interfaces';

export const CREATE_POST_START = '[Posts] Create Post Start';
export const CREATE_POST_SUCCESS = '[Posts] Create Post Success';
export const CREATE_POST_ERROR = '[Posts] Create Post Error';
export const POST_URL_METADATA_START = '[Posts] URL metadata start';
export const POST_URL_METADATA_SUCCESS = '[Posts] URL metadata success';
export const POST_URL_METADATA_ERROR = '[Posts] URL metadata error';
export const CLEAR_URL_METADATA = '[Posts] Clear URL metadata';
export const GET_POST_START = '[Posts] Get single post start';
export const GET_POST_SUCCESS = '[Posts] Get single post success';
export const GET_POST_ERROR = '[Posts] Get single post error';
export const GET_POSTS_START = '[Posts] Get posts start';
export const GET_POSTS_SUCCESS = '[Posts] Get posts success';
export const GET_POSTS_ERROR = '[Posts] Get posts error';

export class CreatePostStart implements Action {
  readonly type = CREATE_POST_START;
  constructor(public payload: PostCreate, public cb: () => void) {}
}

export class CreatePostSuccess implements Action {
  readonly type = CREATE_POST_SUCCESS;
}

export class CreatePostError implements Action {
  readonly type = CREATE_POST_ERROR;
  constructor(public payload: string) {}
}

export class GetPostUrlMetadataStart implements Action {
  readonly type = POST_URL_METADATA_START;
  constructor(public payload: string) {}
}

export class GetPostUrlMetadataSuccess implements Action {
  readonly type = POST_URL_METADATA_SUCCESS;
  constructor(public payload: UrlMetadata) {}
}

export class GetPostUrlMetadataError implements Action {
  readonly type = POST_URL_METADATA_ERROR;
  constructor(public payload: string) {}
}

export class GetPostStart implements Action {
  readonly type = GET_POST_START;
  constructor(public payload: string) {}
}

export class GetPostSuccess implements Action {
  readonly type = GET_POST_SUCCESS;
  constructor(public payload: Post) {}
}

export class GetPostError implements Action {
  readonly type = GET_POST_ERROR;
}

export class GetPostsStart implements Action {
  readonly type = GET_POSTS_START;
  constructor(
    public payload: GetPostsFilter,
    public isFirst: boolean = false
  ) {}
}

export class GetPostsSuccess implements Action {
  readonly type = GET_POSTS_SUCCESS;
  constructor(public payload: PaginationPost) {}
}

export class GetPostsError implements Action {
  readonly type = GET_POSTS_ERROR;
}

export class ClearUrlMetadata implements Action {
  readonly type = CLEAR_URL_METADATA;
}

export type PostsActionTypes =
  | CreatePostStart
  | CreatePostSuccess
  | CreatePostError
  | GetPostUrlMetadataStart
  | GetPostUrlMetadataSuccess
  | GetPostUrlMetadataError
  | GetPostStart
  | GetPostSuccess
  | GetPostError
  | GetPostsStart
  | GetPostsSuccess
  | GetPostsError
  | ClearUrlMetadata;
