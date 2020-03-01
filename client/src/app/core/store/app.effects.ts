import { AuthEffects } from '../../auth/store/auth.effects';
import { TagsEffects } from '../../tags/store/tags.effects';
import { PostsEffects } from '../../posts/store/posts.effects';
import { OpinionsEffects } from '../../opinions/store/opinions.effects';

export const AppEffects = [
  AuthEffects,
  TagsEffects,
  PostsEffects,
  OpinionsEffects,
];
