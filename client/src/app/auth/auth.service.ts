import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl = '/api/auth';
  private usersUrl = '/api/users';

  constructor(private http: HttpClient) {}

  login(authData: AuthActions.LoginStartPayload): Observable<any> {
    return this.http.post<{ accessToken: string }>(
      `${this.authUrl}/login`,
      authData
    );
  }

  register(authData: AuthActions.RegisterStartPayload): Observable<any> {
    return this.http.post<{ accessToken: string }>(
      `${this.authUrl}/register`,
      authData
    );
  }

  fetchMe(): Observable<any> {
    return this.http.get<AuthResponseData>(`${this.usersUrl}/me`);
  }
}
