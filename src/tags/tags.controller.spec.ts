import { TestingModule, Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { GetPostsFilterDto } from '../posts/dto/get-posts-filter.dto';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { GetTagsFilterDto } from './dto/get-tags-filter.dto';

const mockTag = { title: 'test', _id: 'uuid' } as any;
const mockUser = { _id: 'user uuid' } as any;

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            getTag: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve(mockTag)),
            getTags: jest
              .fn()
              .mockImplementation((filterDto: GetTagsFilterDto) =>
                Promise.resolve([mockTag])
              ),
            createTag: jest
              .fn()
              .mockImplementation((createTag, user) =>
                Promise.resolve(mockTag)
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTag', () => {
    it('should return a tag', () => {
      expect(controller.getTag('uuid')).resolves.toEqual(mockTag);
    });
  });

  describe('getTags', () => {
    it('should return a list of tag', () => {
      expect(
        controller.getTags({ search: 'a' } as GetPostsFilterDto)
      ).resolves.toEqual([mockTag]);
    });
  });

  describe('createTag', () => {
    it('should return a tag', () => {
      expect(controller.createTag(mockTag, mockUser)).resolves.toEqual(mockTag);
    });
    it('should call tagService createTag function with mockTag and mockUser', () => {
      controller.createTag(mockTag, mockUser);
      expect(service.createTag).toBeCalledWith(mockTag, mockUser);
    });
  });
});
