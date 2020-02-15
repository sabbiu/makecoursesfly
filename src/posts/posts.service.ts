import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { TagsService } from '../tags/tags.service';
import { PostDoc } from './interfaces/post-document.interface';
import { PostsPagination } from './interfaces/posts-pagination.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly tagService: TagsService,

    @InjectModel('Post')
    private readonly postModel: Model<PostDoc>
  ) {}

  async getPosts(filterDto: GetPostsFilterDto): Promise<PostsPagination> {
    const { search, limit, offset, sortby, order } = filterDto;

    const query = {} as any;

    if (search) query.$text = { $search: search };

    const data = await this.postModel
      .find(query)
      .sort({ [sortby]: order })
      .skip(offset)
      .limit(limit);
    const count = await this.postModel.countDocuments(query);

    return { data, offset, limit, count };
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: UserDoc
  ): Promise<PostDoc> {
    const { title, url, tagsNew, tagsOld } = createPostDto;
    const { _id } = user;

    try {
      let tags: string[] = [];
      if (tagsNew) {
        const found = (
          await this.tagService.find({ title: { $in: tagsNew } })
        ).map(tag => tag.title);

        const inserted = (
          await this.tagService.insertMany(
            tagsNew
              .filter(tag => !found.includes(tag))
              .map(tag => ({ title: tag, createdBy: _id }))
          )
        ).map(tag => tag._id);

        tags = [...tags, ...inserted];
      }

      if (tagsOld) {
        const found = (
          await this.tagService.find({ _id: { $in: tagsOld } })
        ).map(tag => tag._id);

        tags = [...tags, ...found];
      }

      const post = await this.postModel.create({
        title,
        url,
        tags,
        createdBy: _id,
      });

      return await post.populate('tags', 'title').execPopulate();
    } catch (error) {
      console.log(error);
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
