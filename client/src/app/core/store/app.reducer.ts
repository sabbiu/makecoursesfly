import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromTags from '../../tags/store/tags.reducer';
import * as fromPosts from '../../posts/store/posts.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  tags: fromTags.TagsState;
  posts: fromPosts.PostsState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  tags: fromTags.tagsReducer,
  posts: fromPosts.postsReducer,
};
