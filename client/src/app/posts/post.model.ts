import { Tag } from '../tags/tag.model';

export class Post {
  constructor(
    public _id: string,
    public title: string,
    public url: string,
    public tags: Tag[]
  ) {}
}
