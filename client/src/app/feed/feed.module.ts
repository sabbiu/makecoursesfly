import { NgModule } from '@angular/core';
import { FeedComponent } from './feed.component';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { PostsModule } from '../posts/posts.module';

@NgModule({
  declarations: [FeedComponent, FeedItemComponent],
  imports: [CommonModule, InfiniteScrollModule, RouterModule, PostsModule],
  exports: [FeedComponent],
})
export class FeedModule {}
