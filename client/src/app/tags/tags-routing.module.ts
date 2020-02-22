import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { TagDetailComponent } from './tag-detail/tag-detail.component';
import { TagListComponent } from './tag-list/tag-list.component';

const routes: Routes = [
  {
    path: 'tags',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: TagListComponent,
      },
      {
        path: ':id',
        component: TagDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsRoutingModule {}
