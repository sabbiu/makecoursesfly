import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
  accessToken: string;
  error: string;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  error: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActionTypes
) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.REGISTER_START:
    case AuthActions.AUTO_LOGIN:
      return { ...state, error: null, loading: true };

    case AuthActions.ACCESS_TOKEN:
      return { ...state, accessToken: action.payload, error: null };

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
      };

    case AuthActions.AUTHENTICATE_FAIL:
      return { ...state, error: action.payload, loading: false };

    case AuthActions.LOGOUT:
    case AuthActions.AUTO_LOGIN_NO_USER:
      return { ...initialState };

    default:
      return state;
  }
}
