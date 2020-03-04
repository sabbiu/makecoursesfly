import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UsersModule } from './users/users.module';
import { FeedModule } from './feed/feed.module';
import { FaqComponent } from './faq/faq.component';
import { SearchModule } from './search/search.module';

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, FaqComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InfiniteScrollModule,
    SharedModule,
    CoreModule,
    AuthModule,
    PostsModule,
    TagsModule,
    UsersModule,
    FeedModule,
    SearchModule,
    RouterModule.forChild([{ path: '**', redirectTo: '404' }]),
    AccordionModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
