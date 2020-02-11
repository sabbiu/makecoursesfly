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
  photo: string;
}

@Injectable()
export class AuthEffects {
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
    if (!errorRes.error || !errorRes.error.message) {
      // return of(new AuthActions.AuthenticateFail(errorMessage));
    } else {
      // errorMessage = {};
      // errorRes.error.message.forEach((errorItem: any) => {
      //   errorMessage[errorItem.property] = {};
      //   for (let key in errorItem.constraints) {
      //     if (errorItem.constraints.hasOwnProperty(key)) {
      //       errorMessage[errorItem.property][key] = true;
      //     }
      //   }
      // });
      errorRes.error.message.forEach((errorItem: any) => {
        if (
          errorItem.property === 'username' &&
          errorItem.constraints.duplicate
        ) {
          errorMessage = errorItem.constraints.duplicate;
        }
      });
    }
    this.notificationService.error(errorMessage);
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

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
    switchMap(() => {
      return this.http.get<AuthResponseData>('/api/users/me').pipe(
        map(resData => {
          return new AuthActions.AuthenticateSuccess({
            id: resData._id,
            username: resData.username,
            name: resData.name,
            photo: resData.photo,
            redirect: true,
          });
        })
      );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.action$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.handleError = this.handleError.bind(this);
  }
}
