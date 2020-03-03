import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as OpinionsActions from './opinions.actions';
import {
  switchMap,
  map,
  catchError,
  mergeMap,
  concatMap,
  withLatestFrom,
} from 'rxjs/operators';
import { OpinionsService } from '../opinions.service';
import * as fromApp from '../../core/store/app.reducer';

@Injectable()
export class OpinionsEffects {
  @Effect()
  createOpinion$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(OpinionsActions.CREATE_OPINION_START),
    switchMap((action: OpinionsActions.CreateOpinionStart) =>
      this.opinionsService
        .createOpinion(action.payload.body, action.payload.postId)
        .pipe(
          mergeMap(response => [
            new OpinionsActions.CreateOpinionSuccess(response),
            new OpinionsActions.GetMyOpinionStart(action.payload.postId),
          ]),
          catchError(error => {
            return of(new OpinionsActions.CreateOpinionError());
          })
        )
    )
  );

  @Effect()
  getMyOpinion$: Observable<Action> = this.actions$.pipe(
    ofType(OpinionsActions.GET_MY_OPINION_START),
    switchMap((action: OpinionsActions.GetMyOpinionStart) =>
      this.opinionsService.getMyOpinion(action.payload).pipe(
        map(response => new OpinionsActions.GetMyOpinionSuccess(response)),
        catchError(error => of(new OpinionsActions.GetMyOpinionError()))
      )
    )
  );

  @Effect()
  deleteOpinion$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(OpinionsActions.DELETE_OPINION_START),
    switchMap((action: OpinionsActions.DeleteOpinionStart) =>
      this.opinionsService.deleteOpinion(action.payload.opinionId).pipe(
        mergeMap(() => [
          new OpinionsActions.DeleteOpinionSuccess(),
          new OpinionsActions.GetMyOpinionStart(action.payload.postId),
        ]),
        catchError(() => of(new OpinionsActions.DeleteOpinionError()))
      )
    )
  );

  @Effect()
  getOpinionsForPost$ = this.actions$.pipe(
    ofType(OpinionsActions.GET_POST_OPINIONS_START),
    concatMap((action: OpinionsActions.GetPostOpinionsStart) =>
      of(action).pipe(withLatestFrom(this.store.select('opinions')))
    ),
    switchMap(([action, state]) => {
      const params = { ...state.opinionsFilters, ...action.payload };
      return this.opinionsService.getPostOpinions(params, action.postId).pipe(
        map(response => new OpinionsActions.GetPostOpinionsSuccess(response)),
        catchError(error => of(new OpinionsActions.GetPostOpinionsError()))
      );
    })
  );

  @Effect()
  getOpinions$ = this.actions$.pipe(
    ofType(OpinionsActions.GET_OPINIONS_START),
    concatMap((action: OpinionsActions.GetOpinionsStart) =>
      of(action).pipe(withLatestFrom(this.store.select('opinions')))
    ),
    switchMap(([action, state]) => {
      const params = { ...state.feedFilters, ...action.payload };
      return this.opinionsService.getOpinions(params).pipe(
        map(response => new OpinionsActions.GetOpinionsSuccess(response)),
        catchError(error => of(new OpinionsActions.GetOpinionsError()))
      );
    })
  );

  @Effect()
  updateOpinion$ = this.actions$.pipe(
    ofType(OpinionsActions.UPDATE_OPINION_START),
    switchMap((action: OpinionsActions.UpdateOpinionStart) =>
      this.opinionsService
        .updateOpinion(action.payload.body, action.payload.opinionId)
        .pipe(
          mergeMap(response => {
            action.cb();
            return [
              new OpinionsActions.UpdateOpinionSuccess(response),
              new OpinionsActions.GetMyOpinionStart(action.payload.postId),
            ];
          }),
          catchError(error => of(new OpinionsActions.UpdateOpinionError()))
        )
    )
  );

  constructor(
    private actions$: Actions,
    private opinionsService: OpinionsService,
    private store: Store<fromApp.AppState>
  ) {}
}
