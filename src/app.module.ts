import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { PostsModule } from './posts/posts.module';
import { OpinionsModule } from './opinions/opinions.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || config.get('db').uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist', 'client'),
    }),
    AuthModule,
    UsersModule,
    TagsModule,
    PostsModule,
    OpinionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
