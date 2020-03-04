import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../core/store/app.reducer';
import { Opinion } from '../opinion.model';
import * as OpinionsActions from '../store/opinions.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-opinion-list',
  templateUrl: './opinion-list.component.html',
  styleUrls: ['./opinion-list.component.scss'],
})
export class OpinionListComponent implements OnInit, OnDestroy {
  loading: boolean;
  opinions: Opinion[] = [];
  opinionsCount: number;
  opinionsEnd: boolean;
  opinionsSub: Subscription;
  offset: number;
  limit: number;
  throttle = 300;
  scrollDistance = 0.3;
  postId: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id !== this.postId) {
        this.postId = params.id;

        this.store.dispatch(
          new OpinionsActions.GetPostOpinionsStart({}, this.postId, true)
        );
      }
    });

    this.opinionsSub = this.store
      .select('opinions')
      .subscribe(opinionsState => {
        this.loading = opinionsState.opinionsLoading;
        this.opinions = opinionsState.opinions;
        this.opinionsEnd = opinionsState.opinionsEnd;
        this.opinionsCount = opinionsState.opinionsCount;
        this.offset = opinionsState.opinionsFilters.offset;
        this.limit = opinionsState.opinionsFilters.limit;
      });
  }

  onScrollEnd() {
    if (!this.loading && !this.opinionsEnd) {
      this.offset += this.limit;
      this.store.dispatch(
        new OpinionsActions.GetPostOpinionsStart(
          { offset: this.offset },
          this.postId
        )
      );
    }
  }

  ngOnDestroy() {
    this.opinionsSub.unsubscribe();
  }
}
