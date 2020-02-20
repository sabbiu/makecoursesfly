import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../core/store/app.reducer';
import * as PostsActions from '../store/posts.actions';
import { Post } from '../post.model';
import { UrlMetadata } from '../posts.interfaces';

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

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.store.dispatch(new PostsActions.GetPostStart(data.id));
    });

    this.postSub = this.store.select('posts').subscribe(postsData => {
      this.loading = postsData.postLoading;
      this.post = postsData.post;
      this.urlMd = postsData.urlMd;
      this.urlMdError = postsData.urlMdError;
      this.urlMdLoading = postsData.urlMdLoading;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
