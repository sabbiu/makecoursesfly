import { Action } from '@ngrx/store';
import {
  OpinionCreate,
  PaginationOpinion,
  GetOpinionsFilter,
  OpinionUpdate,
} from '../opinions.interfaces';
import { Opinion } from '../opinion.model';

export const CREATE_OPINION_START = '[Opinion] Create opinion start';
export const CREATE_OPINION_SUCCESS = '[Opinion] Create opinion success';
export const CREATE_OPINION_ERROR = '[Opinion] Create opinion error';
export const GET_MY_OPINION_START = '[Opinion] Get my opinion start';
export const GET_MY_OPINION_SUCCESS = '[Opinion] Get my opinion success';
export const GET_MY_OPINION_ERROR = '[Opinion] Get my opinion error';
export const DELETE_OPINION_START = '[Opinion] Delete opinion start';
export const DELETE_OPINION_SUCCESS = '[Opinion] Delete opinion success';
export const DELETE_OPINION_ERROR = '[Opinion] Delete opinion error';
export const GET_OPINIONS_START = '[Opinion] Fetch Opinions Start';
export const GET_OPINIONS_SUCCESS = '[Opinion] Fetch Opinions Success';
export const GET_OPINIONS_ERROR = '[Opinion] Fetch Opinions Error';
export const UPDATE_OPINION_START = '[Opinion] Update Opinion Start';
export const UPDATE_OPINION_SUCCESS = '[Opinion] Update Opinion Success';
export const UPDATE_OPINION_ERROR = '[Opinion] Update Opinion Error';

export class CreateOpinionStart implements Action {
  readonly type = CREATE_OPINION_START;
  constructor(public payload: { body: OpinionCreate; postId: string }) {}
}

export class CreateOpinionSuccess implements Action {
  readonly type = CREATE_OPINION_SUCCESS;
  constructor(public payload: string) {}
}

export class CreateOpinionError implements Action {
  readonly type = CREATE_OPINION_ERROR;
}

export class GetMyOpinionStart implements Action {
  readonly type = GET_MY_OPINION_START;
  constructor(public payload: string) {}
}

export class GetMyOpinionSuccess implements Action {
  readonly type = GET_MY_OPINION_SUCCESS;
  constructor(public payload: Opinion) {}
}

export class GetMyOpinionError implements Action {
  readonly type = GET_MY_OPINION_ERROR;
}

export class DeleteOpinionStart implements Action {
  readonly type = DELETE_OPINION_START;
  constructor(public payload: { opinionId: string; postId: string }) {}
}

export class DeleteOpinionSuccess implements Action {
  readonly type = DELETE_OPINION_SUCCESS;
}

export class DeleteOpinionError implements Action {
  readonly type = DELETE_OPINION_ERROR;
}

export class GetOpinionsStart implements Action {
  readonly type = GET_OPINIONS_START;
  constructor(
    public payload: GetOpinionsFilter,
    public postId: string,
    public isFirst: boolean = false
  ) {}
}

export class GetOpinionSuccess implements Action {
  readonly type = GET_OPINIONS_SUCCESS;
  constructor(public payload: PaginationOpinion) {}
}

export class GetOpinionsError implements Action {
  readonly type = GET_OPINIONS_ERROR;
}

export class UpdateOpinionStart implements Action {
  readonly type = UPDATE_OPINION_START;
  constructor(
    public payload: { body: OpinionUpdate; opinionId: string; postId: string },
    public cb: () => void
  ) {}
}

export class UpdateOpinionSuccess implements Action {
  readonly type = UPDATE_OPINION_SUCCESS;
  constructor(public payload: string) {}
}

export class UpdateOpinionError implements Action {
  readonly type = UPDATE_OPINION_ERROR;
}

export type OpinionsActionTypes =
  | CreateOpinionStart
  | CreateOpinionSuccess
  | CreateOpinionError
  | GetMyOpinionStart
  | GetMyOpinionSuccess
  | GetMyOpinionError
  | DeleteOpinionStart
  | DeleteOpinionSuccess
  | DeleteOpinionError
  | GetOpinionsStart
  | GetOpinionSuccess
  | GetOpinionsError
  | UpdateOpinionStart
  | UpdateOpinionSuccess
  | UpdateOpinionError;
