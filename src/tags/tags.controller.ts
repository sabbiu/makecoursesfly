import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserDoc } from '../auth/interfaces/user-document.interface';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagsFilterDto } from './dto/get-tags-filter.dto';
import { TagsPagination } from './interfaces/tags-pagination.interface';
import { TagDoc } from './interfaces/tag-document.interfact';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  getTags(
    @Query(new ValidationPipe({ transform: true })) filterDto: GetTagsFilterDto
  ): Promise<TagsPagination> {
    return this.tagsService.getTags(filterDto);
  }

  @Post()
  @UseGuards(AuthGuard())
  createTag(
    @Body(new ValidationPipe({ transform: true })) createTagDto: CreateTagDto,
    @GetUser() user: UserDoc
  ): Promise<TagDoc> {
    return this.tagsService.createTag(createTagDto, user);
  }
}
