import * as UsersActions from './users.actions';
import { GetUsersFilter } from '../users.interfaces';
import { User } from '../../auth/user.model';

export interface UsersState {
  usersFilters: GetUsersFilter;
  usersLoading: boolean;
  users: User[];
  usersEnd: boolean;
  usersCount: number;
  userLoading: boolean;
  user: User;
}

const initialState: UsersState = {
  usersFilters: {
    offset: 2,
    limit: 5,
  },
  usersLoading: false,
  users: [],
  usersEnd: false,
  usersCount: null,
  userLoading: false,
  user: null,
};

export function usersReducer(
  state = initialState,
  action: UsersActions.UsersActionTypes
) {
  switch (action.type) {
    case UsersActions.GET_USERS_START:
      return {
        ...state,
        usersFilters: {
          ...(action.isFirst ? initialState.usersFilters : state.usersFilters),
          ...action.payload,
        },
        users: action.isFirst ? [] : state.users,
        usersEnd: action.isFirst ? false : state.usersEnd,
        usersLoading: true,
      };

    case UsersActions.GET_USERS_SUCCESS:
      return {
        ...state,
        users: [...state.users, ...action.payload.data],
        usersLoading: false,
        usersEnd:
          action.payload.data.length >= action.payload.limit
            ? state.usersEnd
            : true,
        usersCount: action.payload.count,
      };

    case UsersActions.GET_USERS_ERROR:
      return { ...state, usersLoading: false };

    case UsersActions.GET_USER_START:
      return { ...state, userLoading: true };

    case UsersActions.GET_USER_ERROR:
      return { ...state, userLoading: false };

    case UsersActions.GET_USER_SUCCESS:
      return { ...state, user: action.payload, userLoading: false };

    default:
      return state;
  }
}
