import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import * as fromApp from '../../core/store/app.reducer';
import * as fromTags from '../../tags/store/tags.reducer';
import * as fromPosts from '../store/posts.reducer';
import * as TagsActions from '../../tags/store/tags.actions';
import * as PostsActions from '../store/posts.actions';
import { Tag } from '../../tags/tag.model';
import { FormHelperService } from '../../core/services/form-helper.service';
import { PostCreate } from '../posts.interfaces';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  form = this.fb.group({
    title: ['', Validators.required],
    url: ['', Validators.required],
    tags: [[], [Validators.required, Validators.minLength(3)]],
  });
  tagsState$: Observable<fromTags.TagsState>;
  postsState$: Observable<fromPosts.PostsState>;
  @ViewChild('confirm', { static: true }) confirm: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    public fhService: FormHelperService,
    private actions$: Actions
  ) {}

  ngOnInit() {
    this.tagsState$ = this.store.select('tags');
    this.postsState$ = this.store.select('posts');
  }

  trackByFn(item: Tag) {
    return item._id;
  }

  onTextChange(text: any) {
    if (text.term)
      this.store.dispatch(new TagsActions.TagsAutocompleteStart(text.term));
  }

  showConfirmDialog() {
    this.confirm.openModal();
  }

  onUrlEntered() {
    // console.log('checking url:', this.url.value);
    if (this.url.value)
      this.store.dispatch(
        new PostsActions.GetPostUrlMetadataStart(this.url.value)
      );
  }

  onSubmit() {
    const { title, url, tags } = this.form.value;
    const body: PostCreate = {
      title,
      url,
    };
    const tagsOld = tags
      .filter((tag: Tag) => !!tag._id)
      .map((tag: Tag) => tag._id);
    if (tagsOld.length) body.tagsOld = tagsOld;
    const tagsNew = tags
      .filter((tag: Tag) => !tag._id)
      .map((tag: Tag) => tag.title);
    if (tagsNew.length) body.tagsNew = tagsNew;
    this.store.dispatch(
      new PostsActions.CreatePostStart(body, () => this.confirm.modalRef.hide())
    );
  }

  get title() {
    return this.form.get('title');
  }
  get url() {
    return this.form.get('url');
  }
  get tags() {
    return this.form.get('tags');
  }
}
