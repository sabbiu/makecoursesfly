import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoggedInGuard } from '../auth/user-logged-in-guard.service';
import { AuthGuard } from '../auth/auth-guard.service';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostListComponent } from './post-list/post-list.component';

const routes: Routes = [
  {
    path: 'posts',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PostListComponent,
      },
      {
        path: 'new',
        component: CreatePostComponent,
        canActivate: [UserLoggedInGuard],
      },
      {
        path: ':id',
        component: PostDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
