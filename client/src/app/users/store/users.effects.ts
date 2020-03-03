import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import {
  switchMap,
  map,
  catchError,
  concatMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import * as UsersActions from './users.actions';
import * as fromApp from '../../core/store/app.reducer';
import { UsersService } from '../users.service';

@Injectable()
export class UsersEffects {
  @Effect()
  getUsers$ = this.actions$.pipe(
    ofType(UsersActions.GET_USERS_START),
    concatMap((action: UsersActions.GetUsersStart) =>
      of(action).pipe(withLatestFrom(this.store.select('users')))
    ),
    switchMap(([action, state]) => {
      const params = { ...state.usersFilters, ...action.payload };
      return this.usersService.getUsers(params).pipe(
        map(response => {
          return new UsersActions.GetUsersSuccess(response);
        }),
        catchError(error => {
          // this.notificationService.error('')
          return of(new UsersActions.GetUsersError());
        })
      );
    })
  );

  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(UsersActions.GET_USER_START),
    switchMap((action: UsersActions.GetUserStart) =>
      this.usersService
        .getUser(action.payload)
        .pipe(map(response => new UsersActions.GetUserSuccess(response)))
    ),
    catchError(error => {
      console.log(error);
      this.router.navigate(['/404']);
      return of(new UsersActions.GetUserError());
    })
  );

  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
}
