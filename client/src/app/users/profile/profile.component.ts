import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../core/store/app.reducer';
import * as UsersActions from '../store/users.actions';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  loading: boolean;
  usersSub: Subscription;
  startFetchingFeed = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.startFetchingFeed = false;
      this.store.dispatch(new UsersActions.GetUserStart(params.id));
      // this.store.dispatch(new OpinionsActions.GetMyOpinionStart(params.username));
    });

    this.usersSub = this.store.select('users').subscribe(usersData => {
      this.loading = usersData.userLoading;
      this.user = usersData.user;
      if (!this.loading && this.user && this.user._id) {
        this.startFetchingFeed = true;
        this.usersService.feedFilterOverride$.next({
          createdBy: this.user._id,
        });
      }
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
