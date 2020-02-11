import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const ACCESS_TOKEN = '[Auth] Access Token';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const REGISTER_START = '[Auth] Register Start';
export const AUTHENTICATE_FAIL = '[Auth] Auth Failed';

export class AccessTokenSuccess implements Action {
  readonly type = ACCESS_TOKEN;
  constructor(public payload: string) {}
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(
    public payload: {
      id: string;
      name: string;
      username: string;
      photo: string;
      redirect: boolean;
    }
  ) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { username: string; password: string }) {}
}

export class RegisterStart implements Action {
  readonly type = REGISTER_START;
  constructor(
    public payload: {
      name: string;
      username: string;
      password: string;
      photo: string;
    }
  ) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export type AuthActionTypes =
  | AuthenticateSuccess
  | LoginStart
  | AccessTokenSuccess
  | RegisterStart
  | AuthenticateFail;
