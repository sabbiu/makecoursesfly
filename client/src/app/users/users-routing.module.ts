import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { UserLoggedInGuard } from '../auth/user-logged-in-guard.service';
import { PeopleComponent } from './people/people.component';

const routes: Routes = [
  {
    path: 'people',
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: 'profile',
      //   component: ProfileComponent,
      //   canActivate: [UserLoggedInGuard],
      // },
      { path: '', component: PeopleComponent },
      { path: ':id', component: ProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
