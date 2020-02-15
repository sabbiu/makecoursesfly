import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { TagDoc } from './interfaces/tag-document.interfact';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagsFilterDto } from './dto/get-tags-filter.dto';
import { TagsPagination } from './interfaces/tags-pagination.interface';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel('Tag')
    private readonly tagModel: Model<TagDoc>
  ) {}

  async getTags(filterDto: GetTagsFilterDto): Promise<TagsPagination> {
    const { search, limit, offset, sortby, order } = filterDto;

    const query = {} as any;

    if (search) query.$text = { $search: search };

    const data = await this.tagModel
      .find(query)
      .sort({ [sortby]: order })
      .skip(offset)
      .limit(limit);
    const count = await this.tagModel.countDocuments(query);

    return { data, offset, limit, count };
  }

  async createTag(createTagDto: CreateTagDto, user: UserDoc): Promise<TagDoc> {
    const { title } = createTagDto;
    const { _id } = user;
    try {
      const newUser = await this.tagModel.create({
        title: title,
        createdBy: _id,
      });
      // return await newUser.populate('createdBy').execPopulate();
      return newUser;
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
