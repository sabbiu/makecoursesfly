import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { FormHelperService } from '../../core/services/form-helper.service';
import * as fromApp from '../../core/store/app.reducer';
import * as OpinionsActions from '../store/opinions.actions';
import { User } from '../../auth/user.model';
import { Opinion } from '../opinion.model';

@Component({
  selector: 'app-opinion-edit',
  templateUrl: './opinion-edit.component.html',
  styleUrls: ['./opinion-edit.component.scss'],
})
export class OpinionEditComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() editMode$: BehaviorSubject<boolean>;
  @Input() opinion: Opinion;

  form = this.fb.group({
    text: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500),
      ],
    ],
  });
  createLoading = false;
  updateLoading = false;
  postId: string;
  opinionsSub: Subscription;
  editModeSub: Subscription;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    public fhService: FormHelperService,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.opinionsSub = this.store
      .select('opinions')
      .subscribe(opinionsState => {
        this.createLoading = opinionsState.createLoading;
        this.updateLoading = opinionsState.updateLoading;
      });
    this.route.params.subscribe(params => {
      this.postId = params.id;
    });
    this.editModeSub = this.editMode$.subscribe(isEdit => {
      this.editMode = isEdit;
      if (isEdit) {
        // do stuff here
        this.form.setValue({ text: this.opinion.text });
      }
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(
        new OpinionsActions.UpdateOpinionStart(
          {
            body: this.form.value,
            opinionId: this.opinion._id,
            postId: this.postId,
          },
          () => this.editMode$.next(false)
        )
      );
    } else {
      this.store.dispatch(
        new OpinionsActions.CreateOpinionStart({
          body: this.form.value,
          postId: this.postId,
        })
      );
    }
  }

  onEditCancel() {
    this.editMode$.next(false);
  }

  ngOnDestroy() {
    this.opinionsSub.unsubscribe();
    this.editModeSub.unsubscribe();
  }

  get text() {
    return this.form.get('text');
  }
}
