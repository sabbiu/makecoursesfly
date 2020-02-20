import { UrlMetadata } from '../../interfaces/url-metadata.interface';
import { PostDoc } from './post-document.interface';

export interface Post {
  post: PostDoc;
  urlMetadata: UrlMetadata;
}
