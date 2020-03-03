import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { UsersRoutingModule } from './users-routing.module';
import { PeopleComponent } from './people/people.component';
import { PostsModule } from '../posts/posts.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FeedModule } from '../feed/feed.module';

@NgModule({
  declarations: [ProfileComponent, PeopleComponent],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    UsersRoutingModule,
    PostsModule,
    FeedModule,
  ],
  exports: [UsersRoutingModule],
})
export class UsersModule {}
