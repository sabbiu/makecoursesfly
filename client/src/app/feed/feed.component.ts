import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../core/store/app.reducer';
import * as OpinionsActions from '../opinions/store/opinions.actions';
import { Feed } from './feed.interfaces';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, OnDestroy {
  @Input() from: string;

  loading: boolean;
  feed: Feed[] = [];
  feedCount: number;
  feedEnd: boolean;
  feedSub: Subscription;
  overrideSub: Subscription;
  offset: number;
  limit: number;
  throttle = 300;
  scrollDistance = 0.3;
  postId: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    if (this.from === 'profile') {
      this.overrideSub = this.usersService.feedFilterOverride$.subscribe(
        overrideFilters => {
          this.store.dispatch(
            new OpinionsActions.GetOpinionsStart({ ...overrideFilters }, true)
          );
        }
      );
    } else {
      this.store.dispatch(new OpinionsActions.GetOpinionsStart({}, true));
    }

    this.feedSub = this.store.select('opinions').subscribe(opinionsState => {
      this.loading = opinionsState.feedLoading;
      this.feed = opinionsState.feed;
      this.feedEnd = opinionsState.feedEnd;
      this.feedCount = opinionsState.feedCount;
      this.offset = opinionsState.feedFilters.offset;
      this.limit = opinionsState.feedFilters.limit;
    });
  }

  onScrollEnd() {
    if (!this.loading && !this.feedEnd) {
      this.offset += this.limit;
      this.store.dispatch(
        new OpinionsActions.GetOpinionsStart({
          offset: this.offset,
        })
      );
    }
  }

  ngOnDestroy() {
    this.feedSub.unsubscribe();
    if (this.overrideSub) {
      this.overrideSub.unsubscribe();
    }
  }
}
