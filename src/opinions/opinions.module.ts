import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { OpinionsController } from './opinions.controller';
import { OpinionsService } from './opinions.service';
import { OpinionSchema } from './schemas/opinion.schema';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Opinion', schema: OpinionSchema }]),
    AuthModule,
    PostsModule,
  ],
  controllers: [OpinionsController],
  providers: [OpinionsService],
})
export class OpinionsModule {}
