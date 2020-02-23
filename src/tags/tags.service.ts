import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { TagDoc } from './interfaces/tag-document.interface';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagsFilterDto } from './dto/get-tags-filter.dto';
import { TagsPagination } from './interfaces/tags-pagination.interface';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel('Tag')
    private readonly tagModel: Model<TagDoc>
  ) {}

  async getTag(id: string): Promise<TagDoc> {
    try {
      return await this.tagModel.findById(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getTags(filterDto: GetTagsFilterDto): Promise<TagsPagination> {
    const { search, limit, offset, sortby, order } = filterDto;

    const aggregation = [] as any;

    const query = {} as any;
    if (search) query.$text = { $search: search };
    if (search) {
      aggregation.push({ $match: query });
    }
    aggregation.push({
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'tags',
        as: 'posts_db',
      },
    });
    aggregation.push({
      $project: { title: 1, createdAt: 1, postsCount: { $size: '$posts_db' } },
    });
    aggregation.push({ $sort: { [sortby]: order } });
    aggregation.push({ $skip: offset });
    aggregation.push({ $limit: limit });

    const data = await this.tagModel.aggregate(aggregation);
    const count = await this.tagModel.countDocuments(query);

    return { data, offset, limit, count };
  }

  async createTag(createTagDto: CreateTagDto, user: UserDoc): Promise<TagDoc> {
    const { title } = createTagDto;
    const { _id } = user;
    try {
      const newTag = await this.tagModel.create({
        title: title,
        createdBy: _id,
      });
      // return await newTag.populate('createdBy').execPopulate();
      return newTag;
    } catch (error) {
      this.handleError(error);
    }
  }

  async find(query: any): Promise<TagDoc[]> {
    return await this.tagModel.find(query);
  }

  async insertMany(
    tags: { title: string; createdBy: string }[]
  ): Promise<TagDoc[]> {
    try {
      return await this.tagModel.insertMany(tags);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    const errorMessages = [];
    if (error && error.errors) {
      if (error.name === 'ValidationError') {
        for (let property in error.errors) {
          if (error.errors.hasOwnProperty(property)) {
            errorMessages.push({
              property,
              constraints: {
                duplicate: error.errors[property].properties.message,
              },
            });
          }
        }
        throw new ConflictException(errorMessages);
      }
    }
    throw new InternalServerErrorException();
  }
}
