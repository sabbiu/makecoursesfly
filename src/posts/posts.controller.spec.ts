import { TestingModule, Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { GetPostsFilterDto } from '../posts/dto/get-posts-filter.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const mockPost = { title: 'test', _id: 'uuid' } as any;
const mockUser = { _id: 'user uuid' } as any;

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            getPost: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve(mockPost)),
            getPosts: jest
              .fn()
              .mockImplementation((filterDto: GetPostsFilterDto) =>
                Promise.resolve([mockPost])
              ),
            createPost: jest
              .fn()
              .mockImplementation((createPost, user) =>
                Promise.resolve('post uuid')
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPost', () => {
    it('should return a post', () => {
      expect(controller.getPost('uuid')).resolves.toEqual(mockPost);
    });
  });

  describe('getPosts', () => {
    it('should return a list of posts', () => {
      expect(
        controller.getPosts({ search: 'a' } as GetPostsFilterDto)
      ).resolves.toEqual([mockPost]);
    });
  });

  describe('createPost', () => {
    it('should return a post id', () => {
      expect(controller.createPost(mockPost, mockUser)).resolves.toEqual(
        'post uuid'
      );
    });
    it('should call postService createTag function with mockPost and mockUser', () => {
      controller.createPost(mockPost, mockUser);
      expect(service.createPost).toBeCalledWith(mockPost, mockUser);
    });
  });
});
