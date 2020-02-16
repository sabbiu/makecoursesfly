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
export class NegateUserLoggedInGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // console.log(' no jer ma');
    return this.store.select('auth').pipe(
      take(1),
      map(authData => {
        // console.log(authData.user);
        if (authData.user) {
          // console.log('ret true');
          this.router.navigate(['/']);
          return false;
        }
        // console.log('ret false');
        return true;
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
