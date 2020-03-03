import { Action } from '@ngrx/store';
import { GetUsersFilter, PaginationUser } from '../users.interfaces';
import { User } from 'src/app/auth/user.model';

export const GET_USERS_START = '[Users] Fetch Users Start';
export const GET_USERS_SUCCESS = '[Users] Fetch Users Success';
export const GET_USERS_ERROR = '[Users] Fetch Users Error';
export const GET_USER_START = '[Users] Fetch User Start';
export const GET_USER_SUCCESS = '[Users] Fetch User Success';
export const GET_USER_ERROR = '[Users] Fetch User Error';

export class GetUsersStart implements Action {
  readonly type = GET_USERS_START;
  constructor(
    public payload: GetUsersFilter,
    public isFirst: boolean = false
  ) {}
}

export class GetUsersSuccess implements Action {
  readonly type = GET_USERS_SUCCESS;
  constructor(public payload: PaginationUser) {}
}

export class GetUsersError implements Action {
  readonly type = GET_USERS_ERROR;
}

export class GetUserStart implements Action {
  readonly type = GET_USER_START;
  constructor(public payload: string) {}
}

export class GetUserSuccess implements Action {
  readonly type = GET_USER_SUCCESS;
  constructor(public payload: User) {}
}

export class GetUserError implements Action {
  readonly type = GET_USER_ERROR;
}

export type UsersActionTypes =
  | GetUsersStart
  | GetUsersSuccess
  | GetUsersError
  | GetUserStart
  | GetUserSuccess
  | GetUserError;
