import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import { NotificationService } from '../../core/services/notification.service';
import { PostsEffects } from './posts.effects';
import { postsReducer } from './posts.reducer';
import { PostsService } from '../posts.service';
import * as PostsActions from './posts.actions';
import { PaginationPost } from '../posts.interfaces';

class MockPostsService {
  getPost = jasmine.createSpy('getPost');
  getPosts = jasmine.createSpy('getPosts');
  createPost = jasmine.createSpy('createPost');
  getUrlMetadata = jasmine.createSpy('getUrlMetadata');
}

class MockRouterService {
  navigate = jasmine.createSpy('navigate');
}

class MockNotificationService {
  error = jasmine.createSpy('error');
}

describe('PostsEffects', () => {
  let actions$: Observable<any>;
  let effects: PostsEffects;
  let postsService: MockPostsService;
  let routerService: MockRouterService;
  let notificationService: MockNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ posts: postsReducer })],
      providers: [
        PostsEffects,
        provideMockActions(() => actions$),
        { provide: PostsService, useClass: MockPostsService },
        { provide: Router, useClass: MockRouterService },
        { provide: NotificationService, useClass: MockNotificationService },
      ],
    });

    effects = TestBed.get(PostsEffects);
    postsService = TestBed.get(PostsService);
    notificationService = TestBed.get(NotificationService);
    routerService = TestBed.get(Router);
    actions$ = TestBed.get(Actions);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('createPost$', () => {
    let post: any;
    beforeEach(() => {
      post = { title: 'test', url: 'asdf' };
    });

    it('should successfully create a post', () => {
      const action = new PostsActions.CreatePostStart(post, () => {});
      const result = 'uuid';
      const completion = new PostsActions.CreatePostSuccess();

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      postsService.createPost.and.returnValue(response);

      expect(effects.createPost$).toBeObservable(expected);
    });

    it('should navigate to post detail page, on success', () => {
      const action = new PostsActions.CreatePostStart(post, () => {});
      const result = 'uuid';

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      postsService.createPost.and.returnValue(response);

      effects.createPost$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/posts', 'uuid']);
      });
    });

    it('should call callback function once, on success', () => {
      const cb = jasmine.createSpy('cb');
      const action = new PostsActions.CreatePostStart(post, cb);
      const result = 'uuid';

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      postsService.createPost.and.returnValue(response);

      effects.createPost$.subscribe(() => {
        expect(cb).toHaveBeenCalledTimes(1);
      });
    });

    describe('on failure', () => {
      let errorConflict: any;
      let errorNotFound: any;

      beforeEach(() => {
        errorConflict = {
          error: {
            message: [{ constraints: { duplicate: 'error' } }],
            statusCode: 409,
          },
        };
        errorNotFound = {
          error: {
            message: [{ constraints: { isUrlReachable: 'error' } }],
            statusCode: 400,
          },
        };
      });

      it('should handle conflict (409) error, on failure', () => {
        const action = new PostsActions.CreatePostStart(post, () => {});
        const completion = new PostsActions.CreatePostError('error');

        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, errorConflict);
        const expected = cold('--c', { c: completion });
        postsService.createPost.and.returnValue(response);

        expect(effects.createPost$).toBeObservable(expected);
      });

      it('should call notification toast, on conflict (409) error', () => {
        const action = new PostsActions.CreatePostStart(post, () => {});

        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, errorConflict);
        postsService.createPost.and.returnValue(response);

        effects.createPost$.subscribe(() => {
          expect(notificationService.error).toHaveBeenCalledWith('error');
        });
      });

      it('should handle notfound (400) error, when url is not reachable', () => {
        const action = new PostsActions.CreatePostStart(post, () => {});
        const completion = new PostsActions.CreatePostError('error');

        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, errorConflict);
        const expected = cold('--c', { c: completion });
        postsService.createPost.and.returnValue(response);

        expect(effects.createPost$).toBeObservable(expected);
      });

      it('should call notification toast, on notfound (400) error', () => {
        const action = new PostsActions.CreatePostStart(post, () => {});

        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, errorNotFound);
        postsService.createPost.and.returnValue(response);

        effects.createPost$.subscribe(() => {
          expect(notificationService.error).toHaveBeenCalledWith('error');
        });
      });

      it('should handle error otherwise, on failure', () => {
        const action = new PostsActions.CreatePostStart(post, () => {});
        const error = 'An unknown error occurred!';
        const completion = new PostsActions.CreatePostError(error);

        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--c', { c: completion });
        postsService.createPost.and.returnValue(response);

        expect(effects.createPost$).toBeObservable(expected);
      });

      it('should call notification toast otherwise, on failure', () => {
        const action = new PostsActions.CreatePostStart(post, () => {});
        const error = 'An unknown error occurred!';

        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, error);
        postsService.createPost.and.returnValue(response);

        effects.createPost$.subscribe(() => {
          expect(notificationService.error).toHaveBeenCalledWith(error);
        });
      });
    });
  });

  describe('getUrlMetadata$', () => {
    it('should successfully return metadata', () => {
      const action = new PostsActions.GetPostUrlMetadataStart('some url');
      const result = { url: 'some url' } as any;
      const completion = new PostsActions.GetPostUrlMetadataSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('-----c', { c: completion });
      postsService.getUrlMetadata.and.returnValue(response);

      expect(
        effects.getUrlMetadata$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });

    it('should return error, on failure', () => {
      const action = new PostsActions.GetPostUrlMetadataStart('some url');
      const completion = new PostsActions.GetPostUrlMetadataError(
        'Url is unreachable'
      );

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, 'error');
      const expected = cold('-----c', { c: completion });
      postsService.getUrlMetadata.and.returnValue(response);

      expect(
        effects.getUrlMetadata$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });
  });

  describe('getPost$', () => {
    it('should return post, on success', () => {
      const action = new PostsActions.GetPostStart('some uuid');
      const result = { _id: 'some uuid', title: 'test', url: 'url' } as any;
      const completion = new PostsActions.GetPostSuccess(result);
      const completion2 = new PostsActions.GetPostUrlMetadataStart(result.url);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--(cd)', { c: completion, d: completion2 });
      postsService.getPost.and.returnValue(response);

      expect(effects.getPost$).toBeObservable(expected);
    });

    it('should return fail action, on failure', () => {
      const action = new PostsActions.GetPostStart('some uuid');
      const error = 'error';
      const completion = new PostsActions.GetPostError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--(b|)', { b: completion });
      postsService.getPost.and.returnValue(response);

      expect(effects.getPost$).toBeObservable(expected);
    });

    it('should navigate to /404, on failure', () => {
      const action = new PostsActions.GetPostStart('some uuid');
      const error = 'error';

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      postsService.getPost.and.returnValue(response);

      effects.getPost$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/404']);
      });
    });
  });

  describe('getPosts$', () => {
    it('should return paginated posts, on success', () => {
      const post = { _id: 'some uuid', title: 'test' };
      const action = new PostsActions.GetPostsStart({});
      const result = { data: [post], count: 1 } as PaginationPost;
      const completion = new PostsActions.GetPostsSuccess(result);

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      const expected = cold('--c', { c: completion });
      postsService.getPosts.and.returnValue(response);

      expect(effects.getPosts$).toBeObservable(expected);
    });

    it('should return fail action, on failure', () => {
      const action = new PostsActions.GetPostsStart({});
      const error = 'error';
      const completion = new PostsActions.GetPostsError();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });
      postsService.getPosts.and.returnValue(response);

      expect(effects.getPosts$).toBeObservable(expected);
    });
  });
});
