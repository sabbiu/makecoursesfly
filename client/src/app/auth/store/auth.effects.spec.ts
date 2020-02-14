import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, empty } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jasmine-marbles';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService, AuthResponseData } from '../auth.service';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

class MockAuthService {
  login = jasmine.createSpy('login');
  register = jasmine.createSpy('register');
  fetchMe = jasmine.createSpy('fetchMe');
}

class MockNotificationService {
  error = jasmine.createSpy('error');
}

class MockRouterService {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthEffects', () => {
  let actions$: TestActions;
  let effects: AuthEffects;
  let notificationService: MockNotificationService;
  let authService: MockAuthService;
  let routerService: MockRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useClass: MockAuthService },
        { provide: Actions, useFactory: getActions },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useClass: MockRouterService },
      ],
    });

    effects = TestBed.get(AuthEffects);
    authService = TestBed.get(AuthService);
    notificationService = TestBed.get(NotificationService);
    routerService = TestBed.get(Router);
    actions$ = TestBed.get(Actions);

    // local storage
    var store = {};

    spyOn(localStorage, 'getItem').and.callFake(function(key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function(key, value) {
      return (store[key] = value + '');
    });
    // spyOn(localStorage, 'clear').and.callFake(function() {
    //   store = {};
    // });
    spyOn(localStorage, 'removeItem').and.callFake(function(key) {
      if (store[key]) delete store[key];
    });
  });

  it('should be created', async () => {
    expect(effects).toBeTruthy();
  });

  describe('authLogin$', () => {
    const user = {
      username: 'Test',
      password: 'pass',
    } as AuthActions.LoginStartPayload;

    it('should return an AuthTokenSuccess, with the login, on success', () => {
      const action = new AuthActions.LoginStart(user);
      const result = { accessToken: 'valid token' };
      const completion = new AuthActions.AccessTokenSuccess('valid token');

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      authService.login.and.returnValue(response);

      expect(effects.authLogin$).toBeObservable(expected);
    });

    it('should return an AuthenticateFail, with the login, on failure', () => {
      const action = new AuthActions.LoginStart(user);
      const error = 'An unknown error occurred!';
      const completion = new AuthActions.AuthenticateFail(error);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });
      authService.login.and.returnValue(response);

      expect(effects.authLogin$).toBeObservable(expected);
      expect(notificationService.error).toHaveBeenCalledWith(error);
    });
  });

  describe('register$', () => {
    const user = {
      username: 'Test',
      password: 'pass',
      email: 'test@test.com',
      name: 'test',
      photo: 'https://example.com',
    } as AuthActions.RegisterStartPayload;

    it('should return an AuthTokenSuccess, with the register, on success', () => {
      const action = new AuthActions.RegisterStart(user);
      const result = { accessToken: 'valid token' };
      const completion = new AuthActions.AccessTokenSuccess('valid token');

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      authService.register.and.returnValue(response);

      expect(effects.register$).toBeObservable(expected);
    });

    it('should return an AuthenticateFail, with the register, on failure', () => {
      const action = new AuthActions.RegisterStart(user);
      const error = 'An unknown error occurred!';
      const completion = new AuthActions.AuthenticateFail(error);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });
      authService.register.and.returnValue(response);

      expect(effects.register$).toBeObservable(expected);
      expect(notificationService.error).toHaveBeenCalledWith(error);
    });
  });

  describe('fetchMe$', () => {
    const user = {
      id: 'uuid',
      username: 'test',
      photo: 'http://example.com',
      name: 'Test',
      email: 'test@test.com',
    } as AuthActions.AuthenticateSuccessPayload;

    const result = {
      _id: 'uuid',
      username: 'test',
      photo: 'http://example.com',
      name: 'Test',
      email: 'test@test.com',
    } as AuthResponseData;

    it('should return an AuthenticateSuccess, on success', () => {
      const action = new AuthActions.AccessTokenSuccess('valid token');
      const completion = new AuthActions.AuthenticateSuccess(user);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      authService.fetchMe.and.returnValue(response);

      expect(effects.fetchMe$).toBeObservable(expected);
      expect(localStorage.getItem('accessToken')).toBe('valid token');
    });

    it('should return an Logout, with the register, on failure due to unauthorized exception', () => {
      const action = new AuthActions.AccessTokenSuccess('valid token');
      const error = { status: 401 };
      const completion = new AuthActions.Logout();

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });
      authService.fetchMe.and.returnValue(response);

      expect(effects.fetchMe$).toBeObservable(expected);
    });

    it('should return nothing, with the register, on failure', () => {
      const action = new AuthActions.AccessTokenSuccess('valid token');
      const error = 'error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('');
      authService.fetchMe.and.returnValue(response);

      expect(effects.fetchMe$).toBeObservable(expected);
    });
  });

  describe('authRedirect$', () => {
    const user = {
      id: 'uuid',
      username: 'test',
      photo: 'http://example.com',
      name: 'Test',
      email: 'test@test.com',
    } as AuthActions.AuthenticateSuccessPayload;

    it('should call navigate method off router, when Logout', () => {
      const action = new AuthActions.Logout();

      actions$.stream = hot('a', { a: action });

      effects.authRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalled();
      });
    });

    it('should call navigate method off router, when Authentication Success', () => {
      const action = new AuthActions.AuthenticateSuccess(user);

      actions$.stream = hot('a', { a: action });

      effects.authRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('autoLogin$', () => {
    it('should return AccessTokenSuccess, if token found, when auto login', () => {
      localStorage.setItem('accessToken', 'valid token');
      const action = new AuthActions.AutoLogin();
      const completion = new AuthActions.AccessTokenSuccess('valid token');

      actions$.stream = hot('a', { a: action });
      const expected = cold('b', { b: completion });

      expect(effects.autoLogin$).toBeObservable(expected);
    });

    it('should return AutoLoginNoUser, if no token found, when auto login', () => {
      const action = new AuthActions.AutoLogin();
      const completion = new AuthActions.AutoLoginNoUser();

      actions$.stream = hot('a', { a: action });
      const expected = cold('b', { b: completion });

      expect(effects.autoLogin$).toBeObservable(expected);
    });
  });

  describe('autoLogout$', () => {
    it('removes accessToken from localstorage', () => {
      localStorage.setItem('accessToken', 'valid token');
      const action = new AuthActions.Logout();

      actions$.stream = hot('a', { a: action });

      effects.authLogout$.subscribe(() => {
        expect(localStorage.getItem('accessToken')).toBeUndefined();
      });
    });
  });
});
