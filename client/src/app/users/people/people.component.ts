import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../core/store/app.reducer';
import * as UsersActions from '../store/users.actions';
import { User } from 'src/app/auth/user.model';
import { SearchService } from 'src/app/search/search.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  @Input() from: string;

  loading: boolean;
  users: User[] = [];
  usersCount: number;
  usersEnd: boolean;
  usersSub: Subscription;
  overrideSub: Subscription;
  offset: number;
  limit: number;
  throttle = 300;
  scrollDistance = 0.3;

  constructor(
    private store: Store<fromApp.AppState>,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    if (this.from === 'search') {
      this.overrideSub = this.searchService.peopleFilterOverride$.subscribe(
        overrideFilters =>
          this.store.dispatch(
            new UsersActions.GetUsersStart({ ...overrideFilters }, true)
          )
      );
    } else {
      this.store.dispatch(new UsersActions.GetUsersStart({}, true));
    }

    this.usersSub = this.store.select('users').subscribe(usersState => {
      this.loading = usersState.usersLoading;
      this.users = usersState.users;
      this.usersEnd = usersState.usersEnd;
      this.usersCount = usersState.usersCount;
      this.offset = usersState.usersFilters.offset;
      this.limit = usersState.usersFilters.limit;
    });
  }

  onScrollEnd() {
    if (!this.loading && !this.usersEnd) {
      this.offset += this.limit;
      this.store.dispatch(
        new UsersActions.GetUsersStart({ offset: this.offset })
      );
    }
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    if (this.overrideSub) {
      this.overrideSub.unsubscribe();
    }
  }
}
