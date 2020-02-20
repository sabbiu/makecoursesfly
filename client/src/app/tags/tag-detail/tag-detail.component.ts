import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TagsService } from '../tags.service';
import * as fromApp from '../../core/store/app.reducer';
import * as TagsActions from '../store/tags.actions';
import * as fromTags from '../store/tags.reducer';

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
})
export class TagDetailComponent implements OnInit {
  tagsState$: Observable<fromTags.TagsState>;

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.store.dispatch(new TagsActions.GetTagStart(params.id));
      this.tagsService.filterOverride$.next({ tags: [params.id] });
    });

    this.tagsState$ = this.store.select('tags');
  }
}
