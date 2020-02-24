import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OpinionEditComponent } from './opinion-edit/opinion-edit.component';
import { OpinionListComponent } from './opinion-list/opinion-list.component';
import { OpinionItemComponent } from './opinion-list/opinion-item/opinion-item.component';

@NgModule({
  imports: [CommonModule, InfiniteScrollModule, ReactiveFormsModule],
  declarations: [
    OpinionEditComponent,
    OpinionListComponent,
    OpinionItemComponent,
  ],
  exports: [OpinionEditComponent, OpinionListComponent, OpinionItemComponent],
})
export class OpinionsModule {}
