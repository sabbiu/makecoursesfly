import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TagWithAnalytics } from '../tags.interfaces';
import * as fromApp from '../../core/store/app.reducer';
import * as TagsActions from '../store/tags.actions';
import { SearchService } from 'src/app/search/search.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit, OnDestroy {
  @Input() from: string;

  loading: boolean;
  tags: TagWithAnalytics[] = [];
  tagsCount: number;
  tagsEnd: boolean;
  tagsSub: Subscription;
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
      this.overrideSub = this.searchService.tagFilterOverride$.subscribe(
        overrideFilters =>
          this.store.dispatch(
            new TagsActions.GetTagsStart({ ...overrideFilters }, true)
          )
      );
    } else {
      this.store.dispatch(new TagsActions.GetTagsStart({}, true));
    }

    this.tagsSub = this.store.select('tags').subscribe(tagsState => {
      this.loading = tagsState.tagsLoading;
      this.tags = tagsState.tags;
      this.tagsEnd = tagsState.tagsEnd;
      this.tagsCount = tagsState.tagsCount;
      this.offset = tagsState.tagsFilters.offset;
      this.limit = tagsState.tagsFilters.limit;
    });
  }

  onScrollEnd() {
    if (!this.loading && !this.tagsEnd) {
      this.offset += this.limit;
      this.store.dispatch(
        new TagsActions.GetTagsStart({ offset: this.offset })
      );
    }
  }

  ngOnDestroy() {
    this.tagsSub.unsubscribe();
    if (this.overrideSub) {
      this.overrideSub.unsubscribe();
    }
  }
}
