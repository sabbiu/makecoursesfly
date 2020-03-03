import { Observable } from 'rxjs';
import { OpinionsEffects } from './opinions.effects';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { opinionsReducer } from './opinions.reducer';
import { provideMockActions } from '@ngrx/effects/testing';
import { OpinionsService } from '../opinions.service';
import { Actions } from '@ngrx/effects';
import * as OpinionsActions from './opinions.actions';
import { hot, cold } from 'jasmine-marbles';
import { PaginationOpinion } from '../opinions.interfaces';
import { PaginationFeed } from '../../feed/feed.interfaces';

const mockOpinion = { _id: 'opinion uuid', text: 'sup dude' } as any;

class MockOpinionService {
  createOpinion = jasmine.createSpy('createOpinion');
  getMyOpinion = jasmine.createSpy('getMyOpinion');
  deleteOpinion = jasmine.createSpy('deleteOpinion');
  getPostOpinions = jasmine.createSpy('getPostOpinions');
  getOpinions = jasmine.createSpy('getOpinions');
  updateOpinion = jasmine.createSpy('updateOpinion');
}

describe('OpinionsEffects', () => {
  let actions$: Observable<any>;
  let effects: OpinionsEffects;
  let opinionsService: MockOpinionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ opinions: opinionsReducer })],
      providers: [
        OpinionsEffects,
        provideMockActions(() => actions$),
        { provide: OpinionsService, useClass: MockOpinionService },
      ],
    });

    effects = TestBed.get(OpinionsEffects);
    opinionsService = TestBed.get(OpinionsService);
    actions$ = TestBed.get(Actions);
  });

  it(`should be created`, () => {
    expect(effects).toBeTruthy();
  });

  describe(`createOpinion$`, () => {
    let opinionBody = { text: 'sup' } as any;
    let payload = { body: opinionBody, postId: 'post id' };

    it(`should successfully create an opinion`, () => {
      const action = new OpinionsActions.CreateOpinionStart(payload);
      const result = 'opinion uuid';
      const completion1 = new OpinionsActions.CreateOpinionSuccess(result);
      const completion2 = new OpinionsActions.GetMyOpinionStart(payload.postId);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--(cd)', { c: completion1, d: completion2 });
      opinionsService.createOpinion.and.returnValue(response);

      expect(effects.createOpinion$).toBeObservable(expected);
    });

    it(`should handle error, on failure`, () => {
      const action = new OpinionsActions.CreateOpinionStart(payload);
      const error = 'Error!!!';
      const completion = new OpinionsActions.CreateOpinionError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--c', { c: completion });
      opinionsService.createOpinion.and.returnValue(response);

      expect(effects.createOpinion$).toBeObservable(expected);
    });
  });

  describe(`getMyOpinion$`, () => {
    it(`should successfully return an opinion`, () => {
      const action = new OpinionsActions.GetMyOpinionStart('uuid');
      const result = { ...mockOpinion };
      const completion = new OpinionsActions.GetMyOpinionSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      opinionsService.getMyOpinion.and.returnValue(response);

      expect(effects.getMyOpinion$).toBeObservable(expected);
    });

    it(`should handle error, on failure`, () => {
      const action = new OpinionsActions.GetMyOpinionStart('uuid');
      const error = 'Error!!!';
      const completion = new OpinionsActions.GetMyOpinionError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--c', { c: completion });
      opinionsService.getMyOpinion.and.returnValue(response);

      expect(effects.getMyOpinion$).toBeObservable(expected);
    });
  });

  describe(`deleteOpinion$`, () => {
    let payload = { opinionId: 'opinion id', postId: 'post id' };

    it(`should successfully delete an opinion`, () => {
      const action = new OpinionsActions.DeleteOpinionStart(payload);
      const result = null;
      const completion1 = new OpinionsActions.DeleteOpinionSuccess();
      const completion2 = new OpinionsActions.GetMyOpinionStart(payload.postId);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--(cd)', { c: completion1, d: completion2 });
      opinionsService.deleteOpinion.and.returnValue(response);

      expect(effects.deleteOpinion$).toBeObservable(expected);
    });

    it(`should handle error, on failure`, () => {
      const action = new OpinionsActions.DeleteOpinionStart(payload);
      const error = 'Error!!!';
      const completion = new OpinionsActions.DeleteOpinionError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--c', { c: completion });
      opinionsService.deleteOpinion.and.returnValue(response);

      expect(effects.deleteOpinion$).toBeObservable(expected);
    });
  });

  describe(`getOpinionsForPost$`, () => {
    it(`should return paginated opinions, on success`, () => {
      const action = new OpinionsActions.GetPostOpinionsStart({}, 'post id');
      const result = { data: [mockOpinion], count: 1 } as PaginationOpinion;
      const completion = new OpinionsActions.GetPostOpinionsSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      opinionsService.getPostOpinions.and.returnValue(response);

      expect(effects.getOpinionsForPost$).toBeObservable(expected);
    });

    it(`should return fail action, on failure`, () => {
      const action = new OpinionsActions.GetPostOpinionsStart({}, 'post id');
      const error = 'error';
      const completion = new OpinionsActions.GetPostOpinionsError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--c', { c: completion });
      opinionsService.getPostOpinions.and.returnValue(response);

      expect(effects.getOpinionsForPost$).toBeObservable(expected);
    });
  });

  describe(`getOpinions$`, () => {
    it(`should return paginated opinions, on success`, () => {
      const action = new OpinionsActions.GetOpinionsStart({});
      const result = { data: [mockOpinion], count: 1 } as PaginationFeed;
      const completion = new OpinionsActions.GetOpinionsSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      opinionsService.getOpinions.and.returnValue(response);

      expect(effects.getOpinions$).toBeObservable(expected);
    });

    it(`should return fail action, on failure`, () => {
      const action = new OpinionsActions.GetOpinionsStart({});
      const error = 'error';
      const completion = new OpinionsActions.GetOpinionsError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--c', { c: completion });
      opinionsService.getOpinions.and.returnValue(response);

      expect(effects.getOpinions$).toBeObservable(expected);
    });
  });

  describe(`updateOpinion$`, () => {
    let payload = {
      body: { text: 'new text' },
      opinionId: 'opinion id',
      postId: 'post id',
    };

    it(`should successfully update an opinion`, () => {
      const action = new OpinionsActions.UpdateOpinionStart(payload, () => {});
      const result = 'opinion id';
      const completion1 = new OpinionsActions.UpdateOpinionSuccess(result);
      const completion2 = new OpinionsActions.GetMyOpinionStart(payload.postId);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--(cd)', { c: completion1, d: completion2 });
      opinionsService.updateOpinion.and.returnValue(response);

      expect(effects.updateOpinion$).toBeObservable(expected);
    });

    it(`should call callback function on success`, () => {
      const cb = jasmine.createSpy('cb');
      const action = new OpinionsActions.UpdateOpinionStart(payload, cb);
      const result = 'opinion uuid';

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      opinionsService.updateOpinion.and.returnValue(response);

      effects.updateOpinion$.subscribe(() => {
        expect(cb).toHaveBeenCalledTimes(1);
      });
    });

    it(`should handle error, on failure`, () => {
      const action = new OpinionsActions.UpdateOpinionStart(payload, () => {});
      const error = 'Error!!!';
      const completion = new OpinionsActions.UpdateOpinionError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--c', { c: completion });
      opinionsService.updateOpinion.and.returnValue(response);

      expect(effects.updateOpinion$).toBeObservable(expected);
    });
  });
});
