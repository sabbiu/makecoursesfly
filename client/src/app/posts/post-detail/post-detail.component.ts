import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import * as fromApp from '../../core/store/app.reducer';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as PostsActions from '../store/posts.actions';
import * as OpinionsActions from '../../opinions/store/opinions.actions';
import { Post } from '../post.model';
import { UrlMetadata } from '../posts.interfaces';
import { Opinion } from 'src/app/opinions/opinion.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post;
  loading: boolean;
  postSub: Subscription;
  urlMd: UrlMetadata;
  urlMdLoading: boolean;
  urlMdError: string;
  authState$: Observable<fromAuth.AuthState>;
  opinionsSub: Subscription;
  opinionLoading = false;
  opinionError = false;
  opinion: Opinion;
  editMode$ = new BehaviorSubject<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.store.dispatch(new PostsActions.GetPostStart(data.id));
      this.store.dispatch(new OpinionsActions.GetMyOpinionStart(data.id));
    });

    this.postSub = this.store.select('posts').subscribe(postsData => {
      this.loading = postsData.postLoading;
      this.post = postsData.post;
      this.urlMd = postsData.urlMd;
      this.urlMdError = postsData.urlMdError;
      this.urlMdLoading = postsData.urlMdLoading;
    });

    this.authState$ = this.store.select('auth');

    this.opinionsSub = this.store.select('opinions').subscribe(opinionsData => {
      this.opinionLoading = opinionsData.getLoading;
      this.opinionError = opinionsData.getError;
      this.opinion = opinionsData.opinion;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.opinionsSub.unsubscribe();
  }
}
