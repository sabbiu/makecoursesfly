import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Opinion } from '../../opinion.model';
import * as OpinionsActions from '../../store/opinions.actions';
import * as fromApp from '../../../core/store/app.reducer';
import * as fromOpinion from '../../store/opinions.reducer';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-opinion-item',
  templateUrl: './opinion-item.component.html',
  styleUrls: ['./opinion-item.component.scss'],
})
export class OpinionItemComponent implements OnInit {
  @Input() opinion: Opinion = null;
  @Input() isUser: boolean;
  @Input() editMode$: BehaviorSubject<boolean>;

  postId: string;
  opinionsState$: Observable<fromOpinion.OpinionsState>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = params.id;
    });

    this.opinionsState$ = this.store.select('opinions');
  }

  onEditClicked() {
    this.editMode$.next(true);
  }

  onDelete() {
    this.store.dispatch(
      new OpinionsActions.DeleteOpinionStart({
        opinionId: this.opinion._id,
        postId: this.postId,
      })
    );
  }
}
