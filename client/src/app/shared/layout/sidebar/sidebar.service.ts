import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../../auth/user.model';
import * as fromApp from '../../../core/store/app.reducer';
import { TagsService } from '../../../tags/tags.service';

interface Badge {
  text: string;
  class: string;
}
interface SubMenu {
  title: string;
  routerLink?: string;
  badge?: Badge;
}
interface Menu {
  title: string;
  type: 'simple' | 'dropdown' | 'header';
  icon?: string;
  routerLink?: string;
  active?: boolean;
  protected?: boolean;
  submenus?: SubMenu[];
  badge?: Badge;
}

@Injectable({ providedIn: 'root' })
export class SidebarService {
  user: User;
  storeSub: Subscription;
  toggled = window.innerWidth <= 768;
  menus$ = new BehaviorSubject<Menu[]>([]);
  submenus: SubMenu[] = [{ title: 'See All', routerLink: '/tags' }];

  constructor(
    private readonly store: Store<fromApp.AppState>,
    private readonly tagsService: TagsService
  ) {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.user = !authState.loading && authState.user;
      this.menus$.next(this.getMenuList());
    });

    this.tagsService
      .getTags({ offset: 0, limit: 5 })
      .pipe(map(tags => tags.data))
      .subscribe(data => {
        this.submenus = [
          ...data.map(tag => ({
            title: tag.title,
            routerLink: `/tags/${tag._id}`,
            badge: {
              text: `${tag.postsCount}`,
              class: 'badge-secondary',
            },
          })),
          { title: 'See All', routerLink: '/tags' },
        ];
        this.menus$.next(this.getMenuList());
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

  onRouteChanged() {
    if (window.innerWidth <= 768) {
      this.toggle();
    }
  }

  getMenuList() {
    const initialMenus: Menu[] = [
      {
        title: 'Home',
        icon: 'fa fa-home',
        type: 'simple',
        routerLink: '/',
      },
      // {
      //   title: 'Profile',
      //   icon: 'fa fa-user-circle',
      //   type: 'simple',
      //   protected: true,
      //   routerLink: '/profile',
      // },
      {
        title: 'Posts',
        icon: 'fa fa-file',
        type: 'simple',
        routerLink: '/posts',
      },
      {
        title: 'Tags',
        icon: 'fa fa-tag',
        type: 'dropdown',
        submenus: this.submenus,
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
        title: 'Add New Course',
        icon: 'fa fa-plus',
        type: 'simple',
        routerLink: '/posts/new',
        protected: true,
      },
      {
        title: 'Others',
        type: 'header',
      },
      {
        title: 'FAQ',
        icon: 'fa fa-question-circle',
        type: 'simple',
        routerLink: '/faq',
      },
    ];
    return initialMenus.filter(menu => (menu.protected ? !!this.user : true));
  }
}
