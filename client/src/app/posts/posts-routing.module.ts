import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoggedInGuard } from '../auth/user-logged-in-guard.service';
import { AuthGuard } from '../auth/auth-guard.service';
import { CreatePostComponent } from './create-post/create-post.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'posts/new',
        component: CreatePostComponent,
        canActivate: [UserLoggedInGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
