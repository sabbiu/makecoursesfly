import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../core/store/app.reducer';
import * as OpinionsActions from '../opinions/store/opinions.actions';
import { Feed } from './feed.interfaces';
import { UsersService } from '../users/users.service';

const INITIAL_OFFSET = 0;
const INITIAL_LIMIT = 20;

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
  offset = INITIAL_OFFSET;
  limit = INITIAL_LIMIT;
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
          this.offset = INITIAL_OFFSET;
          this.limit = INITIAL_LIMIT;
          this.store.dispatch(
            new OpinionsActions.GetOpinionsStart(
              { offset: this.offset, limit: this.limit, ...overrideFilters },
              true
            )
          );
        }
      );
    } else {
      this.store.dispatch(
        new OpinionsActions.GetOpinionsStart(
          { offset: this.offset, limit: this.limit },
          true
        )
      );
    }

    this.feedSub = this.store.select('opinions').subscribe(opinionsState => {
      this.loading = opinionsState.feedLoading;
      this.feed = opinionsState.feed;
      this.feedEnd = opinionsState.feedEnd;
      this.feedCount = opinionsState.feedCount;
    });
  }

  onScrollEnd() {
    if (!this.loading && !this.feedEnd) {
      this.offset += this.limit;
      this.store.dispatch(
        new OpinionsActions.GetOpinionsStart({
          offset: this.offset,
          limit: this.limit,
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
