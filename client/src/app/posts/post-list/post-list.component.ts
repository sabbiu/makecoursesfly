import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as fromApp from '../../core/store/app.reducer';
import * as PostsActions from '../store/posts.actions';
import { Post } from '../post.model';
import { TagsService } from '../../tags/tags.service';

const INITIAL_OFFSET = 0;
const INITIAL_LIMIT = 20;

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() from: string;

  loading: boolean;
  posts: Post[] = [];
  postsCount: number;
  postsEnd: boolean;
  postsSub: Subscription;
  overrideSub: Subscription;
  offset = INITIAL_OFFSET;
  limit = INITIAL_LIMIT;
  throttle = 300;
  scrollDistance = 0.3;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private tagsService: TagsService
  ) {}

  ngOnInit() {
    if (this.from === 'tags') {
      this.overrideSub = this.tagsService.filterOverride$.subscribe(
        overrideFilters => {
          this.offset = INITIAL_OFFSET;
          this.limit = INITIAL_LIMIT;
          this.store.dispatch(
            new PostsActions.GetPostsStart(
              { offset: this.offset, limit: this.limit, ...overrideFilters },
              true
            )
          );
        }
      );
    } else {
      this.store.dispatch(
        new PostsActions.GetPostsStart(
          { offset: this.offset, limit: this.limit },
          true
        )
      );
    }

    this.postsSub = this.store.select('posts').subscribe(postsState => {
      this.loading = postsState.postsLoading;
      this.posts = postsState.posts;
      this.postsEnd = postsState.postsEnd;
      this.postsCount = postsState.postsCount;
    });
  }

  onScrollEnd() {
    this.offset += this.limit;
    this.store.dispatch(
      new PostsActions.GetPostsStart({ offset: this.offset, limit: this.limit })
    );
  }

  onPostClick(event, postId: string) {
    if (event.target.dataset.item !== 'link') {
      this.router.navigate(['/posts', postId]);
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    if (this.overrideSub) {
      this.overrideSub.unsubscribe();
    }
  }
}
