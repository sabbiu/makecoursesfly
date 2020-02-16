import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, race, of } from 'rxjs';
import { take, map, switchMap, tap } from 'rxjs/operators';
import * as fromApp from '../core/store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromApp.AppState>,
    private action$: Actions
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('user guard ma xu ');
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        // console.log('reading auth state');
        return authState.autoLoginDispatched;
      }),
      switchMap(dispatched => {
        if (dispatched) {
          // console.log('user guard: dispatched: start');
          return of(true);
        } else {
          // console.log('user guard: no dispatched: start');
          const timer = setTimeout(() => {
            clearTimeout(timer);
            this.store.dispatch(new AuthActions.AutoLogin());
          }, 0);

          const responseOK = this.action$.pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS)
          );
          const responseError = this.action$.pipe(
            ofType(AuthActions.AUTHENTICATE_FAIL)
          );
          const responseNoUser = this.action$.pipe(
            ofType(AuthActions.AUTO_LOGIN_NO_USER)
          );
          return race(responseError, responseOK, responseNoUser).pipe(
            map(() => true)
          );
        }
      })
    );
  }
}
