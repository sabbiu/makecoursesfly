import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromApp from '../../../core/store/app.reducer';
import * as fromAuth from '../../../auth/store/auth.reducer';
import * as AuthActions from '../../../auth/store/auth.actions';

import { Store } from '@ngrx/store';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  authState: Observable<fromAuth.AuthState>;

  constructor(
    private store: Store<fromApp.AppState>,
    public sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.authState = this.store.select('auth');
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  toggleSidebar() {
    this.sidebarService.setSidebarState(!this.sidebarService.getSidebarState());
  }

  getSideBarState() {
    return this.sidebarService.getSidebarState();
  }
}
