import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../auth/get-user.decorator';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { PostsService } from './posts.service';
import { PostDoc } from './interfaces/post-document.interface';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { PostsPagination } from './interfaces/posts-pagination.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(
    @Query(new ValidationPipe({ transform: true })) filterDto: GetPostsFilterDto
  ): Promise<PostsPagination> {
    return this.postsService.getPosts(filterDto);
  }

  @Post()
  @UseGuards(AuthGuard())
  createPost(
    @Body(new ValidationPipe({ transform: true })) createPostDto: CreatePostDto,
    @GetUser() user: UserDoc
  ): Promise<PostDoc> {
    return this.postsService.createPost(createPostDto, user);
  }
}