import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SharedModule } from '../shared/shared.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostItemComponent } from './post-list/post-item/post-item.component';
import { OpinionsModule } from '../opinions/opinions.module';

@NgModule({
  declarations: [
    CreatePostComponent,
    PostDetailComponent,
    PostListComponent,
    PostItemComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostsRoutingModule,
    NgSelectModule,
    SharedModule,
    InfiniteScrollModule,
    OpinionsModule,
  ],
  exports: [PostsRoutingModule, PostListComponent],
})
export class PostsModule {}
