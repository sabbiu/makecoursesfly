import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { TagsModule } from '../tags/tags.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    AuthModule,
    TagsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
