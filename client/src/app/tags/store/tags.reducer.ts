import * as TagsActions from './tags.actions';
import { Tag } from '../tag.model';
import { GetTagsFilter, TagWithAnalytics } from '../tags.interfaces';

export interface TagsState {
  autocompleteLoading: boolean;
  autocompleteData: any[];
  tagLoading: boolean;
  tag: Tag;
  tagsFilters: GetTagsFilter;
  tagsLoading: boolean;
  tags: TagWithAnalytics[];
  tagsEnd: boolean;
  tagsCount: number;
}

const initialState: TagsState = {
  autocompleteLoading: false,
  autocompleteData: [],
  tagLoading: false,
  tag: null,
  tagsFilters: {
    offset: 2,
    limit: 5,
  },
  tagsLoading: false,
  tags: [],
  tagsEnd: false,
  tagsCount: null,
};

export function tagsReducer(
  state = initialState,
  action: TagsActions.TagsActionTypes
) {
  switch (action.type) {
    case TagsActions.TAGS_AUTOCOMPLETE_START:
      return { ...state, autocompleteLoading: true, autocompleteData: [] };

    case TagsActions.TAGS_AUTOCOMPLETE_SUCCESS:
      return {
        ...state,
        autocompleteLoading: false,
        autocompleteData: action.payload,
      };

    case TagsActions.GET_TAG_START:
      return { ...state, tagLoading: true };

    case TagsActions.GET_TAG_ERROR:
      return { ...state, tagLoading: false };

    case TagsActions.GET_TAG_SUCCESS:
      return { ...state, tag: action.payload, tagLoading: false };

    case TagsActions.GET_TAGS_START:
      return {
        ...state,
        tagsFilters: {
          ...(action.isFirst ? initialState.tagsFilters : state.tagsFilters),
          ...action.payload,
        },
        tags: action.isFirst ? [] : state.tags,
        tagsEnd: action.isFirst ? false : state.tagsEnd,
        tagsLoading: true,
      };

    case TagsActions.GET_TAGS_SUCCESS:
      return {
        ...state,
        tags: [...state.tags, ...action.payload.data],
        tagsLoading: false,
        tagsEnd: action.payload.data.length ? state.tagsEnd : true,
        tagsCount: action.payload.count,
      };

    case TagsActions.GET_TAGS_ERROR:
      return { ...state, tagsLoading: false };

    default:
      return state;
  }
}
