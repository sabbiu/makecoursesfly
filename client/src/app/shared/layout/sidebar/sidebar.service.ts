import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, BehaviorSubject } from 'rxjs';

import { User } from '../../../auth/user.model';
import * as fromApp from '../../../core/store/app.reducer';

interface Menu {
  title: string;
  type: 'simple' | 'dropdown' | 'header';
  icon?: string;
  routerLink?: string;
  active?: boolean;
  protected?: boolean;
  submenus?: { title: string }[];
}

@Injectable({ providedIn: 'root' })
export class SidebarService {
  user: User;
  storeSub: Subscription;
  toggled = false;
  menus = new BehaviorSubject<Menu[]>([]);

  constructor(private readonly store: Store<fromApp.AppState>) {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.user = !authState.loading && authState.user;
      this.menus.next(this.getMenuList());
    });
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    const initialMenus: Menu[] = [
      {
        title: 'Home',
        icon: 'fa fa-home',
        type: 'simple',
        routerLink: '/',
      },
      {
        title: 'Profile',
        icon: 'fa fa-user-circle',
        type: 'simple',
        protected: true,
        routerLink: '/profile',
      },
      {
        title: 'Tags',
        icon: 'fa fa-tag',
        type: 'dropdown',
        submenus: [
          { title: 'Dashboard 1' },
          { title: 'Dashboard 2' },
          { title: 'Dashboard 3' },
        ],
      },
      {
        title: 'People',
        icon: 'fa fa-users',
        type: 'simple',
        routerLink: '/people',
      },
      {
        title: 'Action',
        type: 'header',
        protected: true,
      },
      {
        title: 'Create New Post',
        icon: 'fa fa-plus',
        type: 'simple',
        routerLink: '/posts/new',
        protected: true,
      },
    ];

    const modified = initialMenus.filter(menu =>
      menu.protected ? !!this.user : true
    );

    return modified;
  }
}
