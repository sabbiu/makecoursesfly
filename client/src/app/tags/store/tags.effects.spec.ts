import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import { TagsService } from '../tags.service';
import { TagsEffects } from './tags.effects';
import { tagsReducer } from './tags.reducer';
import * as TagsActions from './tags.actions';
import { PaginationTag } from '../tags.interfaces';

class MockTagsService {
  fetchAll = jasmine.createSpy('fetchAll');
  getTag = jasmine.createSpy('getTag');
  getTags = jasmine.createSpy('getTags');
}

class MockRouterService {
  navigate = jasmine.createSpy('navigate');
}

describe('TagsEffects', () => {
  let actions$: Observable<any>;
  let effects: TagsEffects;
  let tagsService: MockTagsService;
  let routerService: MockRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ tags: tagsReducer })],
      providers: [
        TagsEffects,
        provideMockActions(() => actions$),
        { provide: TagsService, useClass: MockTagsService },
        { provide: Router, useClass: MockRouterService },
      ],
    });

    effects = TestBed.get(TagsEffects);
    tagsService = TestBed.get(TagsService);
    routerService = TestBed.get(Router);
    actions$ = TestBed.get(Actions);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('fetchAutocomplete$', () => {
    it('should return list of tags according to params', () => {
      const action = new TagsActions.TagsAutocompleteStart('search');
      const result = {
        data: [{ _id: 'uuid', title: 'test tag' }],
        count: 1,
      };
      const completion = new TagsActions.TagsAutocompleteSuccess(result.data);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('-----c', { c: completion });
      tagsService.fetchAll.and.returnValue(response);

      expect(
        effects.fetchAutocomplete$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });
  });

  describe('getTag$', () => {
    it('should return tag, on success', () => {
      const action = new TagsActions.GetTagStart('some uuid');
      const result = { _id: 'some uuid', title: 'test' };
      const completion = new TagsActions.GetTagSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      tagsService.getTag.and.returnValue(response);

      expect(effects.getTag$).toBeObservable(expected);
    });

    it('should return fail action, on failure', () => {
      const action = new TagsActions.GetTagStart('some uuid');
      const error = 'error';
      const completion = new TagsActions.GetTagError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--(b|)', { b: completion });
      tagsService.getTag.and.returnValue(response);

      expect(effects.getTag$).toBeObservable(expected);
    });

    it('should navigate to /404, on failure', () => {
      const action = new TagsActions.GetTagStart('some uuid');
      const error = 'error';

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      tagsService.getTag.and.returnValue(response);

      effects.getTag$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/404']);
      });
    });
  });

  describe('getTags$', () => {
    it('should return paginated tags, on success', () => {
      const tag = { _id: 'some uuid', title: 'test' };
      const action = new TagsActions.GetTagsStart({});
      const result = { data: [tag], count: 1 } as PaginationTag;
      const completion = new TagsActions.GetTagsSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      tagsService.getTags.and.returnValue(response);

      expect(effects.getTags$).toBeObservable(expected);
    });

    it('should return fail action, on failure', () => {
      const action = new TagsActions.GetTagsStart({});
      const error = 'error';
      const completion = new TagsActions.GetTagsError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });
      tagsService.getTags.and.returnValue(response);

      expect(effects.getTags$).toBeObservable(expected);
    });
  });
});
