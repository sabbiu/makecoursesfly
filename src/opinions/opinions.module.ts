import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';
import { OpinionsController } from './opinions.controller';
import { OpinionsService } from './opinions.service';
import { OpinionSchema } from './schemas/opinion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Opinion', schema: OpinionSchema }]),
    AuthModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [OpinionsController],
  providers: [OpinionsService],
  exports: [OpinionsService],
})
export class OpinionsModule {}
