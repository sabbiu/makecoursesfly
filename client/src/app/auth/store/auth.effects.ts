import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
}

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
          catchError(this.handleError)
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
          catchError(this.handleError)
        );
    })
  );

  @Effect()
  fetchMe = this.action$.pipe(
    ofType(AuthActions.ACCESS_TOKEN),
    switchMap((authTokenAction: AuthActions.AccessTokenSuccess) => {
      return this.http.get<AuthResponseData>('/api/users/me').pipe(
        map(resData => {
          localStorage.setItem('accessToken', authTokenAction.payload);
          return new AuthActions.AuthenticateSuccess({
            id: resData._id,
            username: resData.username,
            email: resData.email,
            name: resData.name,
            photo: resData.photo,
          });
        }),
        catchError((errorRes: any) => {
          if (errorRes.status === 401) {
            return of(new AuthActions.Logout());
          }
          console.log(errorRes);
          return of();
        })
      );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.action$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  @Effect()
  autoLogin = this.action$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        return new AuthActions.AccessTokenSuccess(accessToken);
      }
      return new AuthActions.AutoLoginNoUser();
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.action$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('accessToken');
    })
  );

  private handleError(errorRes: any) {
    console.log(errorRes);
    let errorMessage = 'An unknown error occurred!';
    if (
      errorRes.error &&
      errorRes.error.statusCode &&
      errorRes.error.statusCode === 401
    ) {
      errorMessage = 'Incorrect username of password';
      // return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    if (errorRes.error && errorRes.error.message) {
      const errorArray = errorRes.error.message
        .filter((errorItem: any) => errorItem.constraints.duplicate)
        .map((errorItem: any) => errorItem.constraints.duplicate);
      if (errorArray.length) {
        return errorArray.map((msg: string) => {
          this.notificationService.error(msg);
          return new AuthActions.AuthenticateFail(msg);
        });
      }
    }
    this.notificationService.error(errorMessage);
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.handleError = this.handleError.bind(this);
  }
}
