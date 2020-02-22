import { Injectable } from '@angular/core';
import { Actions, ofType, Effect, createEffect } from '@ngrx/effects';
import { Observable, of, asyncScheduler } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  switchMap,
  map,
  debounceTime,
  catchError,
  concatMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { TagsService } from '../tags.service';
import * as TagsActions from './tags.actions';
import * as fromApp from '../../core/store/app.reducer';

@Injectable()
export class TagsEffects {
  @Effect()
  fetchAutocomplete$ = ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
    this.actions$.pipe(
      ofType(TagsActions.TAGS_AUTOCOMPLETE_START),
      debounceTime(debounce, scheduler),
      switchMap((action: TagsActions.TagsAutocompleteStart) =>
        this.tagsService
          .fetchAll({ search: action.payload, offset: 0, limit: 10 })
          .pipe(
            map(
              response => new TagsActions.TagsAutocompleteSuccess(response.data)
            )
          )
      )
    );

  @Effect()
  getTag$: Observable<Action> = this.actions$.pipe(
    ofType(TagsActions.GET_TAG_START),
    switchMap((action: TagsActions.GetTagStart) =>
      this.tagsService
        .getTag(action.payload)
        .pipe(map(response => new TagsActions.GetTagSuccess(response)))
    ),
    catchError(error => {
      console.log(error);
      this.router.navigate(['/404']);
      return of(new TagsActions.GetTagError());
    })
  );

  @Effect()
  getTags$ = this.actions$.pipe(
    ofType(TagsActions.GET_TAGS_START),
    concatMap((action: TagsActions.GetTagsStart) =>
      of(action).pipe(withLatestFrom(this.store.select('tags')))
    ),
    switchMap(([action, state]) => {
      const params = { ...state.tagsFilters, ...action.payload };
      return this.tagsService.getTags(params).pipe(
        map(response => {
          return new TagsActions.GetTagsSuccess(response);
        }),
        catchError(error => {
          // this.notificationService.error('')
          return of(new TagsActions.GetTagsError());
        })
      );
      // return new PostsActions.GetPostError();
    })
  );

  constructor(
    private actions$: Actions,
    private tagsService: TagsService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
}
