import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200)),
    ]),
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private menusSub: Subscription;
  menus = [];
  activeRoute: string;
  search: string;

  constructor(
    public sidebarService: SidebarService,
    private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.menusSub = this.sidebarService.menus$.subscribe(menus => {
      this.menus = menus;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // console.log('ev', event);
        // this.activeRoute = `/${event.url.split('/')[1]}`;
        this.activeRoute = event.url;
      }
    });

    this.search = this.route.snapshot.queryParams.q || '';
    this.route.queryParams.subscribe(queryParams => {
      this.search = queryParams.q || '';
    });
  }

  onSearch() {
    if (this.router.url.startsWith('/search/')) {
      this.router.navigate([], { queryParams: { q: this.search } });
    } else {
      this.router.navigate(['/search', 'posts'], {
        queryParams: { q: this.search },
      });
    }
  }

  getSideBarState() {
    return this.sidebarService.getSidebarState();
  }

  toggle(currentMenu) {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  getState(currentMenu) {
    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
  }
}
