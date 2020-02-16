import { NgModule } from '@angular/core';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsRoutingModule } from './posts-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CreatePostComponent],
  imports: [CommonModule, ReactiveFormsModule, PostsRoutingModule],
  exports: [PostsRoutingModule],
})
export class PostsModule {}
