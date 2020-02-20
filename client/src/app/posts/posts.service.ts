import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlMetadata, PaginationPost } from './posts.interfaces';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private postsUrl = '/api/posts';

  constructor(private http: HttpClient) {}

  createPost(body: any): Observable<string> {
    return this.http.post<string>(this.postsUrl, body);
  }

  getUrlMetadata(url: string): Observable<UrlMetadata> {
    return this.http.get<UrlMetadata>('/api/url-metadata', { params: { url } });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${id}`);
  }

  getPosts(params: any): Observable<PaginationPost> {
    return this.http.get<PaginationPost>(this.postsUrl, { params });
  }
}
