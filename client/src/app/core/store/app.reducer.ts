import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromTags from '../../tags/store/tags.reducer';
import * as fromPosts from '../../posts/store/posts.reducer';
import * as fromOpinions from '../../opinions/store/opinions.reducer';
import * as fromUsers from '../../users/store/users.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  tags: fromTags.TagsState;
  posts: fromPosts.PostsState;
  opinions: fromOpinions.OpinionsState;
  users: fromUsers.UsersState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  tags: fromTags.tagsReducer,
  posts: fromPosts.postsReducer,
  opinions: fromOpinions.opinionsReducer,
  users: fromUsers.usersReducer,
};
