import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TagWithAnalytics } from '../tags.interfaces';
import * as fromApp from '../../core/store/app.reducer';
import * as TagsActions from '../store/tags.actions';

const INITIAL_OFFSET = 0;
const INITIAL_LIMIT = 20;

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit, OnDestroy {
  loading: boolean;
  tags: TagWithAnalytics[] = [];
  tagsCount: number;
  tagsEnd: boolean;
  tagsSub: Subscription;
  offset = INITIAL_OFFSET;
  limit = INITIAL_LIMIT;
  throttle = 300;
  scrollDistance = 0.3;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(
      new TagsActions.GetTagsStart(
        { offset: this.offset, limit: this.limit },
        true
      )
    );

    this.tagsSub = this.store.select('tags').subscribe(tagsState => {
      this.loading = tagsState.tagsLoading;
      this.tags = tagsState.tags;
      this.tagsEnd = tagsState.tagsEnd;
      this.tagsCount = tagsState.tagsCount;
    });
  }

  onScrollEnd() {
    if (!this.loading) {
      this.offset += this.limit;
      this.store.dispatch(
        new TagsActions.GetTagsStart({ offset: this.offset, limit: this.limit })
      );
    }
  }

  ngOnDestroy() {
    this.tagsSub.unsubscribe();
  }
}
