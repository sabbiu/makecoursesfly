import { NgModule } from '@angular/core';
import { TagsComponent } from './tags.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';
import { TagsRoutingModule } from './tags-routing.module';
import { PostsModule } from '../posts/posts.module';
import { CommonModule } from '@angular/common';
import { TagListComponent } from './tag-list/tag-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [TagsComponent, TagDetailComponent, TagListComponent],
  imports: [CommonModule, TagsRoutingModule, PostsModule, InfiniteScrollModule],
  exports: [TagsRoutingModule],
})
export class TagsModule {}
