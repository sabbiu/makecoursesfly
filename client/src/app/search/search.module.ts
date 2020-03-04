import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { PostsModule } from '../posts/posts.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PostsModule,
    TagsModule,
    UsersModule,
  ],
})
export class SearchModule {}
