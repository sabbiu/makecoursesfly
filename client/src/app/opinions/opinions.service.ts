import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  OpinionCreate,
  PaginationOpinion,
  OpinionUpdate,
} from './opinions.interfaces';
import { Observable } from 'rxjs';
import { Opinion } from './opinion.model';

@Injectable({ providedIn: 'root' })
export class OpinionsService {
  private opinionUrl = '/api/opinions';

  constructor(private http: HttpClient) {}

  createOpinion(body: OpinionCreate, postId: string): Observable<string> {
    return this.http.post<string>(`${this.opinionUrl}/post/${postId}`, body);
  }

  getMyOpinion(postId: string): Observable<Opinion> {
    return this.http.get<Opinion>(
      `${this.opinionUrl}/post/${postId}/myopinion`
    );
  }

  deleteOpinion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.opinionUrl}/${id}`);
  }

  getOpinions(params: any, postId: string): Observable<PaginationOpinion> {
    return this.http.get<PaginationOpinion>(
      `${this.opinionUrl}/post/${postId}`,
      { params }
    );
  }

  updateOpinion(body: OpinionUpdate, opinionId: string): Observable<string> {
    return this.http.patch<string>(`${this.opinionUrl}/${opinionId}`, body);
  }
}
