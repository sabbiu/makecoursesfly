import { TestingModule, Test } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { OpinionsService } from './opinions.service';
import { OpinionDoc } from './interfaces/opinion-document.interface';

const mockOpinion = { _id: 'uuid', text: 'my opinion' } as any;
const mockUser = { _id: 'user uuid' } as any;

describe('OpinionsService', () => {
  let service: OpinionsService;
  let model: Model<OpinionDoc>;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpinionsService,
        {
          provide: getModelToken('Opinion'),
          useValue: {
            find: jest.fn(() => ({
              sort: jest.fn(() => ({
                skip: jest.fn(() => ({
                  limit: jest.fn().mockResolvedValue([]),
                })),
              })),
            })),
            countDocuments: jest.fn(),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockOpinion),
            create: jest.fn().mockResolvedValue(mockOpinion),
          },
        },
        {
          provide: PostsService,
          useValue: {
            getPost: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OpinionsService>(OpinionsService);
    model = module.get<Model<OpinionDoc>>(getModelToken('Opinion'));
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPostOpinions', () => {
    it(`returns list of opinions along with offset, limit and count`, async () => {
      const params = {
        search: 'asdf',
        limit: 10,
        offset: 0,
      } as any;
      jest.spyOn(model, 'countDocuments').mockResolvedValue(0);

      await expect(
        service.getPostOpinions(params, 'post id', mockUser)
      ).resolves.not.toThrow();

      const result = await service.getPostOpinions(params, 'post id', mockUser);
      expect(result).toEqual({
        data: [],
        offset: params.offset,
        limit: params.limit,
        count: 0,
      });
    });
  });

  describe(`getMyPostOpinion`, () => {
    it('should return opinion, when found', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockOpinion]);
      await expect(
        service.getMyPostOpinion('post id', mockUser)
      ).resolves.not.toThrow();
    });

    it(`throws NotFoundException, when opinion is not found`, async () => {
      jest.spyOn(model, 'find').mockResolvedValue([]);
      await expect(
        service.getMyPostOpinion('post id', mockUser)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe(`updateOpinion`, () => {
    it(`should update successfully, when opinion is found`, async () => {
      await expect(
        service.updateOpinion('opinion id', { text: 'sup' })
      ).resolves.not.toThrow();
    });

    it(`throws NotFoundException, when opinion is not found`, async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);
      await expect(
        service.getMyPostOpinion('post id', mockUser)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe(`createOpinion`, () => {
    let mockCreateDto = { text: 'sup' } as any;
    it(`should successfully create opinion`, async () => {
      jest.spyOn(model, 'find').mockResolvedValue([]);
      await expect(
        service.createOpinion(mockCreateDto, 'post id', mockUser)
      ).resolves.not.toThrow();
    });

    it(`throws NotFoundException when post is not found`, async () => {
      jest.spyOn(postsService, 'getPost').mockResolvedValue(null);
      await expect(
        service.createOpinion(mockCreateDto, 'post id', mockUser)
      ).rejects.toThrow(NotFoundException);
    });

    it(`throws ConflictException when opinion for that post already exists`, async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockOpinion]);
      await expect(
        service.createOpinion(mockCreateDto, 'post id', mockUser)
      ).rejects.toThrow(ConflictException);
    });

    it(`throws NotFoundException when post id is not objectId`, async () => {
      jest.spyOn(postsService, 'getPost').mockRejectedValue({
        name: 'ValidationError',
        errors: {
          post: {
            name: 'CastError',
          },
        },
      });

      await expect(
        service.createOpinion(mockCreateDto, 'not objectId', mockUser)
      ).rejects.toThrow(NotFoundException);
    });

    it(`throws InternalServerError, otherwise`, async () => {
      jest.spyOn(postsService, 'getPost').mockRejectedValue('error');
      await expect(
        service.createOpinion(mockCreateDto, 'post id', mockUser)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
