import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthGuard } from './auth-guard.service';
import { NegateUserLoggedInGuard } from './negate-user-logged-in-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [NegateUserLoggedInGuard],
    children: [
      { path: 'sign-in', component: AuthComponent },
      { path: 'register', component: AuthComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
