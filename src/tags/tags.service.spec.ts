import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagsService } from './tags.service';
import { TagDoc } from './interfaces/tag-document.interfact';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetTagsFilterDto } from './dto/get-tags-filter.dto';

const mockTag = {
  title: 'test',
} as any;

const mockUser = {
  _id: 'uuid',
} as any;

describe('TagsService', () => {
  let service: TagsService;
  let model: Model<TagDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getModelToken('Tag'),
          useValue: {
            findById: jest.fn(),
            aggregate: jest.fn(),
            countDocuments: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    model = module.get<Model<TagDoc>>(getModelToken('Tag'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTag', () => {
    it('successfully returns tag, on found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockTag);
      await expect(service.getTag('id')).resolves.not.toThrow();
    });

    it('throws NotFoundException, on error', async () => {
      jest.spyOn(model, 'findById').mockRejectedValue('error');
      await expect(service.getTag('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTags', () => {
    it('returns list of tags along with offset, limit and count', async () => {
      const params = {
        search: 'text',
        limit: 10,
        offset: 0,
      } as GetTagsFilterDto;
      jest.spyOn(model, 'aggregate').mockResolvedValue([mockTag, mockTag]);
      jest.spyOn(model, 'countDocuments').mockResolvedValue(2);

      await expect(service.getTags(params)).resolves.not.toThrow();
      const result = await service.getTags(params);
      expect(result).toEqual({
        data: [mockTag, mockTag],
        offset: params.offset,
        limit: params.limit,
        count: 2,
      });
    });
  });

  describe('createTag', () => {
    it('successfully creates a tag', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(mockTag);
      await expect(service.createTag(mockTag, mockUser)).resolves.not.toThrow();
    });

    it('throws Conflict Exception, as fails to create a tag', async () => {
      jest.spyOn(model, 'create').mockRejectedValue({
        errors: { title: { properties: { message: 'conflict' } } },
        name: 'ValidationError',
      });
      await expect(service.createTag(mockTag, mockUser)).rejects.toThrow(
        ConflictException
      );
    });

    it('throws Internal Server Error Exception otherwise, as fails to create a tag', async () => {
      jest.spyOn(model, 'create').mockRejectedValue('error');
      await expect(service.createTag(mockTag, mockUser)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('find', () => {
    it('calls find function of model with query', async () => {
      service.find('some query');
      expect(model.find).toHaveBeenCalledWith('some query');
    });

    it('resolves find successfully', async () => {
      jest.spyOn(model, 'find').mockResolvedValue(mockTag);
      await expect(service.find('query')).resolves.not.toThrow();
    });
  });

  describe('insertMany', () => {
    it('calls insertMany of model with tags', async () => {
      await service.insertMany([mockTag, mockTag]);
      expect(model.insertMany).toHaveBeenCalledWith([mockTag, mockTag]);
    });

    it('resolves and returns tags successfully', async () => {
      jest.spyOn(model, 'insertMany').mockResolvedValue([mockTag] as any);
      await expect(service.insertMany([mockTag])).resolves.not.toThrow();
    });

    it('throws an error, on failure', async () => {
      jest.spyOn(model, 'insertMany').mockRejectedValue('error');
      await expect(service.insertMany([mockTag])).rejects.toThrow();
    });
  });
});
