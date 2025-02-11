import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { ActionTypesUnion } from './actions/actions';
import * as fromReducer from './reducers/reducers';

export interface State {
  state: fromReducer.IState;
}

export const reducers: ActionReducerMap<State, ActionTypesUnion> = {
  state: fromReducer.reducer,
};

export const getRootState = createFeatureSelector<State>('dating-app');

export const getState = createSelector(getRootState, (state) => state.state);

export const getUser = createSelector(getState, fromReducer.getUser);

export const getErrorMessage = createSelector(
  getState,
  fromReducer.getErrorMessage
);
export const getIsLoading = (transId: Guid) =>
  createSelector(getState, (state: fromReducer.IState) =>
    state.isLoading.get(transId)
  );

export const getHasFailure = (transId: Guid) =>
  createSelector(getState, (state: fromReducer.IState) =>
    state.hasFailure.get(transId)
  );
