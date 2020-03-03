import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaginationUser } from './users.interfaces';
import { User } from '../auth/user.model';
import { GetOpinionsFilter } from '../opinions/opinions.interfaces';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private usersUrl = '/api/users';
  feedFilterOverride$ = new BehaviorSubject<GetOpinionsFilter>({});

  constructor(private http: HttpClient) {}

  getUsers(params: any): Observable<PaginationUser> {
    return this.http.get<PaginationUser>(this.usersUrl, { params });
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${username}`);
  }
}
