import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, Observable, EMPTY } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import * as AuthActions from './auth.actions';
import { Action } from '@ngrx/store';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin$: Observable<Action | Array<Action>> = this.action$.pipe(
    ofType<AuthActions.LoginStart>(AuthActions.LOGIN_START),
    switchMap(action =>
      this.authService.login(action.payload).pipe(
        map(
          tokenData =>
            new AuthActions.AccessTokenSuccess({
              accessToken: tokenData.accessToken,
            })
        ),
        catchError(this.handleError)
      )
    )
  );

  @Effect()
  register$: Observable<Action | Array<Action>> = this.action$.pipe(
    ofType(AuthActions.REGISTER_START),
    switchMap((action: AuthActions.RegisterStart) =>
      this.authService.register(action.payload).pipe(
        map(
          tokenData =>
            new AuthActions.AccessTokenSuccess({
              accessToken: tokenData.accessToken,
            })
        ),
        catchError(this.handleError)
      )
    )
  );

  @Effect()
  fetchMe$ = this.action$.pipe(
    ofType(AuthActions.ACCESS_TOKEN),
    switchMap((action: AuthActions.AccessTokenSuccess) =>
      this.authService.fetchMe().pipe(
        map(resData => {
          localStorage.setItem('accessToken', action.payload.accessToken);
          return new AuthActions.AuthenticateSuccess({
            id: resData._id,
            username: resData.username,
            email: resData.email,
            name: resData.name,
            photo: resData.photo,
            redirect: action.payload.redirect,
          });
        }),
        catchError((errorRes: any) => {
          if (errorRes.status === 401) {
            return of(new AuthActions.Logout());
          }
          console.log(errorRes);
          return EMPTY;
        })
      )
    )
  );

  @Effect({ dispatch: false })
  authRedirect$ = this.action$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap((actionData: AuthActions.AuthenticateSuccess | AuthActions.Logout) => {
      if (
        actionData.type === AuthActions.LOGOUT ||
        (actionData.type === AuthActions.AUTHENTICATE_SUCCESS &&
          actionData.payload.redirect)
      ) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin$ = this.action$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        return new AuthActions.AccessTokenSuccess({
          accessToken,
          redirect: false,
        });
      }
      return new AuthActions.AutoLoginNoUser();
    })
  );

  @Effect({ dispatch: false })
  authLogout$ = this.action$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('accessToken');
    })
  );

  private handleError(errorRes: any): Observable<Action | Array<Action>> {
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
    if (
      errorRes.error &&
      errorRes.error.message &&
      errorRes.error.statusCode &&
      errorRes.error.statusCode === 409
    ) {
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
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.handleError = this.handleError.bind(this);
  }
}
