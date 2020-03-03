import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../core/store/app.reducer';
import * as UsersActions from '../store/users.actions';
import { User } from 'src/app/auth/user.model';

const INITIAL_OFFSET = 0;
const INITIAL_LIMIT = 20;

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  loading: boolean;
  users: User[] = [];
  usersCount: number;
  usersEnd: boolean;
  usersSub: Subscription;
  offset = INITIAL_OFFSET;
  limit = INITIAL_LIMIT;
  throttle = 300;
  scrollDistance = 0.3;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(
      new UsersActions.GetUsersStart(
        { offset: this.offset, limit: this.limit },
        true
      )
    );

    this.usersSub = this.store.select('users').subscribe(usersState => {
      this.loading = usersState.usersLoading;
      this.users = usersState.users;
      this.usersEnd = usersState.usersEnd;
      this.usersCount = usersState.usersCount;
    });
  }

  onScrollEnd() {
    if (!this.loading && !this.usersEnd) {
      this.offset += this.limit;
      this.store.dispatch(
        new UsersActions.GetUsersStart({
          offset: this.offset,
          limit: this.limit,
        })
      );
    }
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
