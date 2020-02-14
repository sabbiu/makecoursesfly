import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from './core/store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import * as fromAuth from './auth/store/auth.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // storeSub: Subscription;
  authState: Observable<fromAuth.AuthState>;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.authState = this.store.select('auth');
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
