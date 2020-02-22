import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as fromApp from '../core/store/app.reducer';

@Injectable({ providedIn: 'root' })
export class UserLoggedInGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('jer ma');
    return this.store.select('auth').pipe(
      map(authData => {
        // console.log(authData.user);
        if (!authData.user) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
