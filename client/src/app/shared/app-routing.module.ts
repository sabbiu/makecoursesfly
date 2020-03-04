import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { FeedComponent } from '../feed/feed.component';
import { FaqComponent } from '../faq/faq.component';
import { SearchComponent } from '../search/search.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: FeedComponent },
      { path: '404', component: PageNotFoundComponent },
      { path: 'faq', component: FaqComponent },
      {
        path: 'search',
        children: [
          { path: 'posts', component: SearchComponent },
          { path: 'tags', component: SearchComponent },
          { path: 'people', component: SearchComponent },
          { path: '', redirectTo: 'posts', pathMatch: 'full' },
        ],
      },
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
