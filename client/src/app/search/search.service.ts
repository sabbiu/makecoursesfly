import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GetPostsFilter } from '../posts/posts.interfaces';
import { GetTagsFilter } from '../tags/tags.interfaces';
import { GetUsersFilter } from '../users/users.interfaces';

@Injectable({ providedIn: 'root' })
export class SearchService {
  postFilterOverride$ = new BehaviorSubject<GetPostsFilter>({});
  tagFilterOverride$ = new BehaviorSubject<GetTagsFilter>({});
  peopleFilterOverride$ = new BehaviorSubject<GetUsersFilter>({});
}
