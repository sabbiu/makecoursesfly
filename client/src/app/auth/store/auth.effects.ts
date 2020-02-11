import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.action$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<{ accessToken: string }>('/api/auth/login', authData.payload)
        .pipe(
          map(tokenData => {
            return new AuthActions.AccessTokenSuccess(tokenData.accessToken);
          }),
          catchError(errorRes => {
            return of();
          })
        );
    })
  );

  @Effect()
  fetchMe = this.action$.pipe(
    ofType(AuthActions.ACCESS_TOKEN),
    switchMap(() => {
      return this.http.get<AuthResponseData>('/api/users/me').pipe(
        map(resData => {
          return new AuthActions.AuthenticateSuccess({
            id: resData._id,
            username: resData.username,
            name: resData.name,
            photo: resData.photo,
          });
        })
      );
    })
  );

  @Effect()
  register = this.action$.pipe(
    ofType(AuthActions.REGISTER_START),
    switchMap((authData: AuthActions.RegisterStart) => {
      return this.http
        .post<{ accessToken: string }>('/api/auth/register', authData.payload)
        .pipe(
          map(
            tokenData =>
              new AuthActions.AccessTokenSuccess(tokenData.accessToken)
          ),
          catchError(errorRes => {
            return of();
          })
        );
    })
  );

  constructor(private action$: Actions, private http: HttpClient) {}
}
