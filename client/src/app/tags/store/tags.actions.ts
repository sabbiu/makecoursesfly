import { Action } from '@ngrx/store';
import { Tag } from '../tag.model';
import { GetTagsFilter, PaginationTag } from '../tags.interfaces';

export const TAGS_AUTOCOMPLETE_START = '[Tags] Fetch for autocomplete start';
export const TAGS_AUTOCOMPLETE_SUCCESS =
  '[Tags] Fetch for autocomplete success';
export const GET_TAG_START = '[Tags] Get Tag Start';
export const GET_TAG_SUCCESS = '[Tags] Get Tag Success';
export const GET_TAG_ERROR = '[Tags] Get Tag Error';
export const GET_TAGS_START = '[Tags] Fetch Tags Start';
export const GET_TAGS_SUCCESS = '[Tags] Fetch Tags Success';
export const GET_TAGS_ERROR = '[Tags] Fetch Tags Error';

export class TagsAutocompleteStart implements Action {
  readonly type = TAGS_AUTOCOMPLETE_START;
  constructor(public payload: string) {}
}

export class TagsAutocompleteSuccess implements Action {
  readonly type = TAGS_AUTOCOMPLETE_SUCCESS;
  constructor(public payload: Tag[]) {}
}

export class GetTagStart implements Action {
  readonly type = GET_TAG_START;
  constructor(public payload: string) {}
}

export class GetTagSuccess implements Action {
  readonly type = GET_TAG_SUCCESS;
  constructor(public payload: Tag) {}
}

export class GetTagError implements Action {
  readonly type = GET_TAG_ERROR;
}

export class GetTagsStart implements Action {
  readonly type = GET_TAGS_START;
  constructor(public payload: GetTagsFilter, public isFirst: boolean = false) {}
}

export class GetTagsSuccess implements Action {
  readonly type = GET_TAGS_SUCCESS;
  constructor(public payload: PaginationTag) {}
}

export class GetTagsError implements Action {
  readonly type = GET_TAGS_ERROR;
}

export type TagsActionTypes =
  | TagsAutocompleteStart
  | TagsAutocompleteSuccess
  | GetTagStart
  | GetTagSuccess
  | GetTagError
  | GetTagsStart
  | GetTagsSuccess
  | GetTagsError;
