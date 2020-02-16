import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
  accessToken: string;
  error: string;
  loading: boolean;
  autoLoginDispatched: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  error: null,
  loading: false,
  autoLoginDispatched: false,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActionTypes
) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.REGISTER_START:
      return {
        ...state,
        error: null,
        loading: true,
        autoLoginDispatched: true,
      };

    case AuthActions.AUTO_LOGIN:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case AuthActions.ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        error: null,
        autoLoginDispatched: true,
      };

    case AuthActions.AUTHENTICATE_SUCCESS:
      return {
        ...state,
        user: new User(
          action.payload.id,
          action.payload.name,
          action.payload.email,
          action.payload.username,
          action.payload.photo
        ),
        error: null,
        loading: false,
        autoLoginDispatched: true,
      };

    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        error: action.payload,
        autoLoginDispatched: true,
        loading: false,
      };

    case AuthActions.LOGOUT:
    case AuthActions.AUTO_LOGIN_NO_USER:
      return {
        ...state,
        user: null,
        accessToken: null,
        error: null,
        loading: false,
        autoLoginDispatched: true,
      };

    default:
      return state;
  }
}
