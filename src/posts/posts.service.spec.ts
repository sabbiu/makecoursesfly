import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from './posts.service';
import { PostDoc } from './interfaces/post-document.interface';
import { TagsService } from '../tags/tags.service';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

const mockPost = {
  title: 'test',
} as any;

const mockUser = {
  _id: 'uuid',
} as any;

const mockCreatePostDto: CreatePostDto = {
  url: 'example.com',
  title: 'test',
  tagsNew: ['test'],
  tagsOld: [],
};

const mockTag = {
  title: 'tag title',
  _id: 'tag uuid',
};

describe('PostsService', () => {
  let service: PostsService;
  let model: Model<PostDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken('Post'),
          useValue: {
            find: jest.fn(() => ({
              sort: jest.fn(() => ({
                skip: jest.fn(() => ({
                  limit: jest.fn().mockResolvedValue([]),
                })),
              })),
            })),
            countDocuments: jest.fn(),
            findById: jest.fn(() => ({
              populate: jest.fn().mockResolvedValue(mockPost),
            })),
            create: jest.fn(),
          },
        },
        {
          provide: TagsService,
          useValue: {
            find: jest.fn().mockResolvedValue([mockTag]),
            insertMany: jest.fn().mockResolvedValue([mockTag]),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get<Model<PostDoc>>(getModelToken('Post'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('returns list of posts along with offset, limit and count', async () => {
      const params = {
        search: 'text',
        limit: 10,
        offset: 0,
      } as GetPostsFilterDto;
      jest.spyOn(model, 'countDocuments').mockResolvedValue(0);

      await expect(service.getPosts(params)).resolves.not.toThrow();
      const result = await service.getPosts(params);
      expect(result).toEqual({
        data: [],
        offset: params.offset,
        limit: params.limit,
        count: 0,
      });
    });
  });

  describe('getPost', () => {
    it('successfully returns post, on found', async () => {
      await expect(service.getPost('id')).resolves.not.toThrow();
    });

    it('throws NotFoundException, on error', async () => {
      jest.spyOn(model, 'findById').mockImplementation(
        (id: string) =>
          ({
            populate: jest.fn().mockRejectedValue('error'),
          } as any)
      );
      await expect(service.getPost('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPost', () => {
    it('successfully creates a post', async () => {
      jest
        .spyOn(model, 'create')
        .mockResolvedValue({ _id: 'post uuid' } as any);
      await expect(
        service.createPost(mockCreatePostDto, mockUser)
      ).resolves.not.toThrow();
    });

    it('throws ConflictException, when url is duplicate', async () => {
      jest.spyOn(model, 'create').mockRejectedValue({
        errors: { url: { properties: { message: 'conflict' } } },
        name: 'ValidationError',
      });
      await expect(
        service.createPost(mockCreatePostDto, mockUser)
      ).rejects.toThrow(ConflictException);
    });

    it('throws InternalServerError Exception otherwise, on failure', async () => {
      jest.spyOn(model, 'create').mockRejectedValue('error');
      await expect(
        service.createPost(mockCreatePostDto, mockUser)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
