import * as OpinionsActions from './opinions.actions';
import { Opinion } from '../opinion.model';
import { GetOpinionsFilter } from '../opinions.interfaces';
import { GetFeedFilter, Feed } from 'src/app/feed/feed.interfaces';

export interface OpinionsState {
  createLoading: boolean;
  getLoading: boolean;
  getError: boolean;
  opinion: Opinion;
  deleteLoading: boolean;
  opinionsFilters: GetOpinionsFilter;
  opinionsLoading: boolean;
  opinions: Opinion[];
  opinionsEnd: boolean;
  opinionsCount: number;
  updateLoading: boolean;
  updateError: boolean;
  feedFilters: GetFeedFilter;
  feedLoading: boolean;
  feed: Feed[];
  feedEnd: boolean;
  feedCount: number;
}

const initialState: OpinionsState = {
  createLoading: false,
  getLoading: false,
  getError: false,
  opinion: null,
  deleteLoading: false,
  opinionsFilters: { offset: 0, limit: 20 },
  opinionsLoading: false,
  opinions: [],
  opinionsEnd: false,
  opinionsCount: null,
  updateLoading: false,
  updateError: false,
  feedFilters: { offset: 0, limit: 20 },
  feedLoading: false,
  feed: [],
  feedEnd: false,
  feedCount: null,
};

export function opinionsReducer(
  state = initialState,
  action: OpinionsActions.OpinionsActionTypes
) {
  switch (action.type) {
    case OpinionsActions.CREATE_OPINION_START:
      return { ...state, createLoading: true };

    case OpinionsActions.CREATE_OPINION_SUCCESS:
    case OpinionsActions.CREATE_OPINION_ERROR:
      return { ...state, createLoading: false };

    case OpinionsActions.GET_MY_OPINION_START:
      return { ...state, getLoading: true, getError: false, opinion: null };

    case OpinionsActions.GET_MY_OPINION_ERROR:
      return { ...state, getLoading: false, getError: true };

    case OpinionsActions.GET_MY_OPINION_SUCCESS:
      return { ...state, getLoading: false, opinion: action.payload };

    case OpinionsActions.DELETE_OPINION_START:
      return { ...state, deleteLoading: true };

    case OpinionsActions.DELETE_OPINION_SUCCESS:
    case OpinionsActions.DELETE_OPINION_ERROR:
      return { ...state, deleteLoading: false };

    case OpinionsActions.GET_POST_OPINIONS_START:
      return {
        ...state,
        opinionsFilters: {
          ...(action.isFirst
            ? initialState.opinionsFilters
            : state.opinionsFilters),
          ...action.payload,
        },
        opinions: action.isFirst ? [] : state.opinions,
        opinionsEnd: action.isFirst ? false : state.opinionsEnd,
        opinionsLoading: true,
      };

    case OpinionsActions.GET_POST_OPINIONS_SUCCESS:
      return {
        ...state,
        opinions: [...state.opinions, ...action.payload.data],
        opinionsLoading: false,
        opinionsEnd:
          action.payload.data.length >= action.payload.limit
            ? state.opinionsEnd
            : true,
        opinionsCount: action.payload.count,
      };

    case OpinionsActions.GET_POST_OPINIONS_ERROR:
      return { ...state, opinionsLoading: false };

    case OpinionsActions.UPDATE_OPINION_START:
      return { ...state, updateLoading: true };

    case OpinionsActions.UPDATE_OPINION_SUCCESS:
    case OpinionsActions.UPDATE_OPINION_ERROR:
      return { ...state, updateLoading: false };

    case OpinionsActions.GET_OPINIONS_START:
      return {
        ...state,
        feedFilters: {
          ...(action.isFirst ? initialState.feedFilters : state.feedFilters),
          ...action.payload,
        },
        feed: action.isFirst ? [] : state.feed,
        feedEnd: action.isFirst ? false : state.feedEnd,
        feedLoading: true,
      };

    case OpinionsActions.GET_OPINIONS_SUCCESS:
      return {
        ...state,
        feed: [...state.feed, ...action.payload.data],
        feedLoading: false,
        feedEnd:
          action.payload.data.length >= action.payload.limit
            ? state.feedEnd
            : true,
        feedCount: action.payload.count,
      };

    case OpinionsActions.GET_OPINIONS_ERROR:
      return { ...state, feedLoading: false };

    default:
      return state;
  }
}
