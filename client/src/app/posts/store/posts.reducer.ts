import * as PostsActions from './posts.actions';
import { Post } from '../post.model';
import { UrlMetadata, GetPostsFilter } from '../posts.interfaces';

export interface PostsState {
  createLoading: boolean;
  createError: string;
  urlMd: UrlMetadata;
  urlMdLoading: boolean;
  urlMdError: string;
  postLoading: boolean;
  post: Post;
  postsFilters: GetPostsFilter;
  postsLoading: boolean;
  posts: Post[];
  postsEnd: boolean;
  postsCount: number;
}

const initialState: PostsState = {
  createLoading: false,
  createError: null,
  urlMd: null,
  urlMdError: null,
  urlMdLoading: false,
  postLoading: false,
  post: null,
  postsFilters: { offset: 2, limit: 5 },
  postsLoading: false,
  posts: [],
  postsEnd: false,
  postsCount: null,
};

export function postsReducer(
  state = initialState,
  action: PostsActions.PostsActionTypes
) {
  switch (action.type) {
    case PostsActions.CREATE_POST_START:
      return { ...state, createLoading: true, createError: null };

    case PostsActions.CREATE_POST_ERROR:
      return { ...state, createLoading: false, createError: action.payload };

    case PostsActions.CREATE_POST_SUCCESS:
      return { ...state, createLoading: false };

    case PostsActions.POST_URL_METADATA_START:
      return { ...state, urlMdLoading: true, urlMdError: null, urlMd: null };

    case PostsActions.POST_URL_METADATA_SUCCESS:
      return { ...state, urlMdLoading: false, urlMd: action.payload };

    case PostsActions.POST_URL_METADATA_ERROR:
      return { ...state, urlMdLoading: false, urlMdError: action.payload };

    case PostsActions.CLEAR_URL_METADATA:
      return { ...state, urlMd: null };

    case PostsActions.GET_POST_START:
      return { ...state, postLoading: true };

    case PostsActions.GET_POST_ERROR:
      return { ...state, postLoading: false };

    case PostsActions.GET_POST_SUCCESS:
      return { ...state, post: action.payload, postLoading: false };

    case PostsActions.GET_POSTS_START:
      return {
        ...state,
        postsFilters: {
          ...(action.isFirst ? initialState.postsFilters : state.postsFilters),
          ...action.payload,
        },
        posts: action.isFirst ? [] : state.posts,
        postsEnd: action.isFirst ? false : state.postsEnd,
        postsLoading: true,
      };

    case PostsActions.GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload.data],
        postsLoading: false,
        postsEnd:
          action.payload.data.length >= action.payload.limit
            ? state.postsEnd
            : true,
        postsCount: action.payload.count,
      };

    case PostsActions.GET_POSTS_ERROR:
      return { ...state, postsLoading: false };

    default:
      return state;
  }
}
