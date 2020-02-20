import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PostListComponent } from '../posts/post-list/post-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PostListComponent },
      { path: '404', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
