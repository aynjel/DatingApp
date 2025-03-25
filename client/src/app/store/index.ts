import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { ActionTypesUnion } from './actions/actions';
import * as fromReducer from './reducers/reducers';

export interface State {
  datingAppState: fromReducer.IState;
}

export const FEATURE_KEY = 'datingAppState';

export const reducers: ActionReducerMap<State, ActionTypesUnion> = {
  datingAppState: fromReducer.reducer,
};

export const getRootState = createFeatureSelector<State>(FEATURE_KEY);

export const getState = createSelector(
  getRootState,
  (state: State) => state.datingAppState
);

export const getUser = createSelector(getState, fromReducer.getUser);

export const getErrorMessage = createSelector(
  getState,
  fromReducer.getErrorMessage
);

export const getIsLoading = createSelector(getState, fromReducer.getIsLoading);

export const getHasFailure = createSelector(getState, fromReducer.getFailure);
