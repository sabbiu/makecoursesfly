import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { UsersEffects } from './users.effects';
import { usersReducer } from './users.reducer';
import { UsersService } from '../users.service';
import * as UsersActions from './users.actions';
import { PaginationUser } from '../users.interfaces';

class MockUsersService {
  getUser = jasmine.createSpy('getUser');
  getUsers = jasmine.createSpy('getUsers');
}

class MockRouterService {
  navigate = jasmine.createSpy('navigate');
}

describe('UsersEffects', () => {
  let actions$: Observable<any>;
  let effects: UsersEffects;
  let usersService: MockUsersService;
  let routerService: MockRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ users: usersReducer })],
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useClass: MockUsersService },
        { provide: Router, useClass: MockRouterService },
      ],
    });

    effects = TestBed.get(UsersEffects);
    usersService = TestBed.get(UsersService);
    routerService = TestBed.get(Router);
    actions$ = TestBed.get(Actions);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return user, on success', () => {
      const action = new UsersActions.GetUserStart('some uuid');
      const result = { _id: 'some uuid', username: 'test' } as any;
      const completion = new UsersActions.GetUserSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      usersService.getUser.and.returnValue(response);

      expect(effects.getUser$).toBeObservable(expected);
    });

    it('should return fail action, on failure', () => {
      const action = new UsersActions.GetUserStart('some uuid');
      const error = 'error';
      const completion = new UsersActions.GetUserError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--(b|)', { b: completion });
      usersService.getUser.and.returnValue(response);

      expect(effects.getUser$).toBeObservable(expected);
    });

    it('should navigate to /404, on failure', () => {
      const action = new UsersActions.GetUserStart('some uuid');
      const error = 'error';

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      usersService.getUser.and.returnValue(response);

      effects.getUser$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/404']);
      });
    });
  });

  describe('getUsers$', () => {
    it('should return paginated users, on success', () => {
      const user = { _id: 'some uuid', text: 'test' } as any;
      const action = new UsersActions.GetUsersStart({});
      const result = { data: [user], count: 1 } as PaginationUser;
      const completion = new UsersActions.GetUsersSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      usersService.getUsers.and.returnValue(response);

      expect(effects.getUsers$).toBeObservable(expected);
    });

    it('should return fail action, on failure', () => {
      const action = new UsersActions.GetUsersStart({});
      const error = 'error';
      const completion = new UsersActions.GetUsersError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });
      usersService.getUsers.and.returnValue(response);

      expect(effects.getUsers$).toBeObservable(expected);
    });
  });
});
