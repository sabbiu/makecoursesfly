import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpinionDoc } from './interfaces/opinion-document.interface';
import { CreateOpinionDto } from './dto/create-opinion.dto';
import { UserDoc } from 'src/auth/interfaces/user-document.interface';
import { PostsService } from 'src/posts/posts.service';
import { GetOpinionsFilterDto } from './dto/get-opinions-filter.dto';
import { OpinionsPagination } from './interfaces/opinions-pagination.interface';
import { UpdateOpinionDto } from './dto/update-opinion.dto';

@Injectable()
export class OpinionsService {
  constructor(
    @InjectModel('Opinion')
    private readonly opinionModel: Model<OpinionDoc>,
    private postsService: PostsService
  ) {}

  async getPostOpinions(
    filterDto: GetOpinionsFilterDto,
    postId: string
  ): Promise<OpinionsPagination> {
    const { search, sortby, limit, offset, order } = filterDto;

    const query = {} as any;
    if (search) query.$text = { $search: search };
    query.post = postId;

    const data = await this.opinionModel
      .find(query)
      .sort({ [sortby]: order })
      .skip(offset)
      .limit(limit);

    const count = await this.opinionModel.countDocuments(query);

    return { data, count, limit, offset };
  }

  async getMyPostOpinion(postId: string, user: UserDoc): Promise<OpinionDoc> {
    const opinions = await this.opinionModel.find({
      post: postId,
      createdBy: user._id,
    });
    if (opinions.length) {
      return opinions[0];
    }
    return null;
  }

  async updateOpinion(
    id: string,
    updateOpinion: UpdateOpinionDto
  ): Promise<string> {
    const { text } = updateOpinion;
    const updated = await this.opinionModel.findByIdAndUpdate(id, {
      $set: { text },
    });
    if (!updated)
      throw new NotFoundException(`Opinion with id: ${id} doesn't exist`);

    return updated.id;
  }

  async deleteOpinion(id: string): Promise<void> {
    const deleted = await this.opinionModel.findByIdAndRemove(id);
    if (!deleted)
      throw new NotFoundException(`Opinion with id: ${id} doesn't exist`);
  }

  async createOpinion(
    createOpinionDto: CreateOpinionDto,
    postId: string,
    user: UserDoc
  ): Promise<string> {
    const { text } = createOpinionDto;
    const { _id: userId } = user;

    try {
      const post = await this.postsService.getPost(postId);
      if (post === null) {
        throw new NotFoundException(`Post with id: ${postId} doesn't exist`);
      }
      const opinion = await this.opinionModel.find({
        createdBy: userId,
        post: postId,
      });
      if (opinion && opinion.length) {
        throw new ConflictException(
          'Your opinion for this post already exists'
        );
      }
      const newOpinion = await this.opinionModel.create({
        text,
        createdBy: userId,
        post: postId,
      });
      return newOpinion._id;
    } catch (error) {
      // console.log(error.status);
      this.handleError(error, postId);
    }
  }

  private handleError(error: any, postId: string) {
    if (error && error.errors) {
      if (error.name === 'ValidationError') {
        for (let property in error.errors) {
          if (error.errors.hasOwnProperty(property)) {
            console.log(error.errors[property], property);
            if (
              property === 'post' &&
              error.errors[property].name === 'CastError'
            ) {
              throw new NotFoundException(
                `Post with id: ${postId} doesn't exist`
              );
            }
          }
        }
      }
    }
    if (error && error.status && [404, 409].includes(error.status)) {
      throw error;
    }
    throw new InternalServerErrorException();
  }
}
