import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const ACCESS_TOKEN = '[Auth] Access Token';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const REGISTER_START = '[Auth] Register Start';
export const AUTHENTICATE_FAIL = '[Auth] Auth Failed';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const AUTO_LOGIN_NO_USER = '[Auth] Auto Login No User';

export class AccessTokenSuccess implements Action {
  readonly type = ACCESS_TOKEN;
  constructor(public payload: { accessToken: string; redirect?: boolean }) {
    if (typeof this.payload.redirect === 'undefined') {
      this.payload.redirect = true;
    }
  }
}

export interface AuthenticateSuccessPayload {
  id: string;
  name: string;
  email: string;
  username: string;
  photo: string;
  redirect: boolean;
}
export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(public payload: AuthenticateSuccessPayload) {}
}

export interface LoginStartPayload {
  username: string;
  password: string;
}
export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: LoginStartPayload) {}
}

export interface RegisterStartPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  photo: string;
}
export class RegisterStart implements Action {
  readonly type = REGISTER_START;
  constructor(public payload: RegisterStartPayload) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class AutoLoginNoUser implements Action {
  readonly type = AUTO_LOGIN_NO_USER;
}

export type AuthActionTypes =
  | AuthenticateSuccess
  | LoginStart
  | AccessTokenSuccess
  | RegisterStart
  | AuthenticateFail
  | Logout
  | AutoLogin
  | AutoLoginNoUser;
