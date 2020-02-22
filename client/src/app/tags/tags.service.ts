import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Tag } from './tag.model';
import { GetPostsFilter } from '../posts/posts.interfaces';
import { PaginationTag } from './tags.interfaces';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private tagsUrl = '/api/tags';
  filterOverride$ = new BehaviorSubject<GetPostsFilter>({});

  constructor(private http: HttpClient) {}

  fetchAll(params: any): Observable<any> {
    return this.http.get<{ data: Tag[] }>(this.tagsUrl, { params });
  }

  getTag(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.tagsUrl}/${id}`);
  }

  getTags(params: any): Observable<PaginationTag> {
    return this.http.get<PaginationTag>(this.tagsUrl, { params });
  }
}
