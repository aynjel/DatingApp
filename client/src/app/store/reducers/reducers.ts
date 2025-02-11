import { Guid } from 'guid-typescript';
import { NgrxError } from 'src/app/types/error.types';
import { TUser } from 'src/app/types/user.models';
import { setAndDeletePropertyFromMap } from '../../utils/utils';
import { ActionTypes, ActionTypesUnion } from '../actions/actions';

export interface IState {
  isLoading: Map<Guid, boolean>;
  hasFailure: Map<Guid, NgrxError>;
  user: TUser | null;
  errorMessage: string | null;
}

export const INITIAL_STATE: IState = {
  isLoading: new Map<Guid, boolean>(),
  hasFailure: new Map<Guid, NgrxError>(),
  user: null,
  errorMessage: null,
};

export function reducer(
  state = INITIAL_STATE,
  action: ActionTypesUnion
): IState {
  switch (action.type) {
    case ActionTypes.LOGIN_USER: {
      return {
        ...state,
        user: action.payload[1],
        isLoading: setAndDeletePropertyFromMap<IState, boolean>(
          state,
          'isLoading',
          true,
          action.payload[0]
        ),
      };
    }
    case ActionTypes.LOGIN_USER_SUCCESS: {
      return {
        ...state,
        user: action.payload[1],
        isLoading: setAndDeletePropertyFromMap<IState, boolean>(
          state,
          'isLoading',
          false,
          action.payload[0]
        ),
      };
    }
    case ActionTypes.REGISTER_USER: {
      return {
        ...state,
        isLoading: setAndDeletePropertyFromMap<IState, boolean>(
          state,
          'isLoading',
          true,
          action.payload[0]
        ),
      };
    }
    case ActionTypes.REGISTER_USER_SUCCESS: {
      return {
        ...state,
        user: action.payload[1],
        isLoading: setAndDeletePropertyFromMap<IState, boolean>(
          state,
          'isLoading',
          false,
          action.payload[0]
        ),
      };
    }
    case ActionTypes.LOGOUT_USER: {
      return {
        ...state,
        user: null,
      };
    }
    case ActionTypes.ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: action.payload,
      };
    }
    case ActionTypes.FAILURE: {
      return {
        ...state,
        hasFailure: setAndDeletePropertyFromMap<IState, NgrxError>(
          state,
          'hasFailure',
          action.payload[1],
          action.payload[0]
        ),
      };
    }
    case ActionTypes.RESET_STORE: {
      return INITIAL_STATE;
    }
    default: {
      return state;
    }
  }
}

export const getUser = (state: IState) => state.user;

export const getErrorMessage = (state: IState) => state.errorMessage;

export const getIsLoading = (state: IState, transId: Guid) =>
  state.isLoading.has(transId);

export const getFailure = (state: IState, transId: Guid) =>
  state.hasFailure.get(transId)!;
