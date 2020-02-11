import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
  accessToken: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActionTypes
) {
  switch (action.type) {
    case AuthActions.ACCESS_TOKEN:
      return { ...state, accessToken: action.payload };

    case AuthActions.AUTHENTICATE_SUCCESS:
      return {
        ...state,
        user: new User(
          action.payload.id,
          action.payload.name,
          action.payload.username,
          action.payload.photo
        ),
      };

    default:
      return state;
  }
}
