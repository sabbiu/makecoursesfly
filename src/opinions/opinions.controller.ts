import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OpinionsService } from './opinions.service';
import { CreateOpinionDto } from './dto/create-opinion.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserDoc } from 'src/auth/interfaces/user-document.interface';
import { GetOpinionsFilterDto } from './dto/get-opinions-filter.dto';
import { OpinionsPagination } from './interfaces/opinions-pagination.interface';
import { OpinionDoc } from './interfaces/opinion-document.interface';
import { UpdateOpinionDto } from './dto/update-opinion.dto';
import { OptionalAuthGuard } from 'src/auth/optional-auth-guard.service';

@Controller('opinions')
export class OpinionsController {
  constructor(private opinionsService: OpinionsService) {}

  @Post('post/:id')
  @UseGuards(AuthGuard())
  createOpinion(
    @Body(new ValidationPipe({ transform: true }))
    createOpinionDto: CreateOpinionDto,
    @GetUser() user: UserDoc,
    @Param('id') postId: string
  ): Promise<string> {
    return this.opinionsService.createOpinion(createOpinionDto, postId, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  updateOpinion(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateOpinionDto: UpdateOpinionDto
  ): Promise<string> {
    return this.opinionsService.updateOpinion(id, updateOpinionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteOpinion(@Param('id') id: string): Promise<void> {
    return this.opinionsService.deleteOpinion(id);
  }

  @Get('post/:id')
  @UseGuards(OptionalAuthGuard)
  getPostOpinions(
    @Query(new ValidationPipe({ transform: true }))
    filterDto: GetOpinionsFilterDto,
    @Param('id') postId: string,
    @GetUser() user: UserDoc
  ): Promise<OpinionsPagination> {
    return this.opinionsService.getPostOpinions(filterDto, postId, user);
  }

  @Get('post/:id/myopinion')
  @UseGuards(AuthGuard())
  getMyPostOpinion(
    @GetUser() user: UserDoc,
    @Param('id') postId: string
  ): Promise<OpinionDoc> {
    return this.opinionsService.getMyPostOpinion(postId, user);
  }
}
