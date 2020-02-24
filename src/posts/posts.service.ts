import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { TagsService } from '../tags/tags.service';
import { PostDoc } from './interfaces/post-document.interface';
import { PostsPagination } from './interfaces/posts-pagination.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { OpinionsService } from '../opinions/opinions.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly tagsService: TagsService,

    @Inject(forwardRef(() => OpinionsService))
    private readonly opinionsService: OpinionsService,

    @InjectModel('Post')
    private readonly postModel: Model<PostDoc>
  ) {}

  async getPosts(filterDto: GetPostsFilterDto): Promise<PostsPagination> {
    const { search, limit, offset, sortby, order, tags } = filterDto;

    const query = {} as any;

    if (search) query.$text = { $search: search };
    if (tags && tags.length) query.tags = { $in: tags };

    const data = await this.postModel
      .find(query)
      .sort({ [sortby]: order })
      .skip(offset)
      .limit(limit);
    const count = await this.postModel.countDocuments(query);

    return { data, offset, limit, count };
  }

  async getPost(id: string): Promise<PostDoc> {
    try {
      return await this.postModel.findById(id).populate('tags', '_id title');
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: UserDoc
  ): Promise<string> {
    const { title, url, tagsNew, tagsOld, opinion } = createPostDto;
    const { _id } = user;

    try {
      let tags: string[] = [];
      if (tagsNew) {
        const found = (
          await this.tagsService.find({ title: { $in: tagsNew } })
        ).map(tag => tag.title);

        const inserted = (
          await this.tagsService.insertMany(
            tagsNew
              .filter(tag => !found.includes(tag))
              .map(tag => ({ title: tag, createdBy: _id }))
          )
        ).map(tag => tag._id);

        tags = [...tags, ...inserted];
      }

      if (tagsOld) {
        const found = (
          await this.tagsService.find({ _id: { $in: tagsOld } })
        ).map(tag => tag._id);

        tags = [...tags, ...found];
      }

      const post = await this.postModel.create({
        title,
        url,
        tags,
        createdBy: _id,
      });

      await this.opinionsService.createOpinion(
        { text: opinion },
        post._id,
        user
      );

      // return await post.populate('tags', 'title').execPopulate();
      return post._id;
    } catch (error) {
      // console.log(error);
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
