import { Observable, of, asyncScheduler } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, ofType, Effect } from '@ngrx/effects';
import {
  switchMap,
  map,
  tap,
  catchError,
  debounceTime,
  concatMap,
  withLatestFrom,
  mergeMap,
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../posts.service';
import * as PostsActions from './posts.actions';
import { NotificationService } from '../../core/services/notification.service';
import * as fromApp from '../../core/store/app.reducer';

@Injectable()
export class PostsEffects {
  @Effect()
  createPost$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(PostsActions.CREATE_POST_START),
    switchMap((action: PostsActions.CreatePostStart) =>
      this.postsService.createPost(action.payload).pipe(
        tap(() => {
          action.cb();
        }),
        map(response => {
          this.router.navigate(['/posts', response]);
          return new PostsActions.CreatePostSuccess();
        }),
        catchError(this.handleError)
      )
    )
  );

  @Effect()
  getUrlMetadata$ = ({ debounce = 800, scheduler = asyncScheduler } = {}) =>
    this.actions$.pipe(
      ofType(PostsActions.POST_URL_METADATA_START),
      debounceTime(debounce, scheduler),
      switchMap((action: PostsActions.GetPostUrlMetadataStart) =>
        this.postsService.getUrlMetadata(action.payload).pipe(
          map(response => new PostsActions.GetPostUrlMetadataSuccess(response)),
          catchError(error =>
            of(new PostsActions.GetPostUrlMetadataError('Url is unreachable'))
          )
        )
      )
    );

  @Effect()
  getPost$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(PostsActions.GET_POST_START),
    switchMap((action: PostsActions.GetPostStart) =>
      this.postsService.getPost(action.payload).pipe(
        mergeMap(response => {
          const actions: PostsActions.PostsActionTypes[] = [
            new PostsActions.GetPostSuccess(response),
          ];
          if (response.url) {
            actions.push(
              new PostsActions.GetPostUrlMetadataStart(response.url)
            );
          }
          return actions;
        })
      )
    ),
    catchError(error => {
      console.log(error);
      this.router.navigate(['/404']);
      return of(new PostsActions.GetPostError());
    })
  );

  @Effect()
  getPosts$ = this.actions$.pipe(
    ofType(PostsActions.GET_POSTS_START),
    concatMap((action: PostsActions.GetPostsStart) =>
      of(action).pipe(withLatestFrom(this.store.select('posts')))
    ),
    switchMap(([action, state]) => {
      const params = { ...state.postsFilters, ...action.payload };
      return this.postsService.getPosts(params).pipe(
        map(response => {
          return new PostsActions.GetPostsSuccess(response);
        }),
        catchError(error => {
          // this.notificationService.error('')
          return of(new PostsActions.GetPostsError());
        })
      );
      // return new PostsActions.GetPostError();
    })
  );

  private handleError(errorRes: any): Observable<Action | Action[]> {
    console.log(errorRes);
    let errorMessage = 'An unknown error occurred!';

    if (errorRes.error && errorRes.error.message && errorRes.error.statusCode) {
      if (errorRes.error.statusCode === 409) {
        const errorArray = errorRes.error.message
          .filter((errorItem: any) => errorItem.constraints.duplicate)
          .map((errorItem: any) => errorItem.constraints.duplicate);
        if (errorArray.length) {
          return errorArray.map((msg: string) => {
            this.notificationService.error(msg);
            return new PostsActions.CreatePostError(msg);
          });
        }
      }

      if (errorRes.error.statusCode === 400) {
        const errorArray = errorRes.error.message
          .filter((errorItem: any) => errorItem.constraints.isUrlReachable)
          .map((errorItem: any) => errorItem.constraints.isUrlReachable);
        if (errorArray.length) {
          return errorArray.map((msg: string) => {
            this.notificationService.error(msg);
            return new PostsActions.CreatePostError(msg);
          });
        }
      }
    }
    this.notificationService.error(errorMessage);
    return of(new PostsActions.CreatePostError(errorMessage));
  }

  constructor(
    private actions$: Actions,
    private postsService: PostsService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<fromApp.AppState>
  ) {
    this.handleError = this.handleError.bind(this);
  }
}
