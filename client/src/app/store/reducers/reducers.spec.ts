import { Guid } from 'guid-typescript';
import { LoginResponse } from '../../types/api/response.models';
import * as fromAction from './../actions/actions';
import * as fromReducer from './reducers';

describe('Reducer', () => {
  let state: fromReducer.IState;

  beforeEach(() => {
    state = fromReducer.INITIAL_STATE;
  });

  it('should return the default state', () => {
    const action = {} as fromAction.ActionTypesUnion;
    const result = fromReducer.reducer(state, action);

    expect(result).toBe(state);
  });

  it('should call LOGIN_USER Action in reducer_Positive', () => {
    const transId: Guid = Guid.create();
    const action: fromAction.LoginUser = {
      type: fromAction.ActionTypes.LOGIN_USER,
      payload: [
        transId,
        {
          email: 'test@mail.com',
          password: 'test',
        },
      ],
    };
    const result = fromReducer.reducer(state, action);
    const expected = {
      ...state,
      isLoading: new Map([[transId, true]]),
    };

    expect(result).toEqual(expected);
  });

  it('should call LOGIN_USER_SUCCESS Action in reducer_Positive', () => {
    const transId: Guid = Guid.create();
    const mockData: LoginResponse = {
      error: 'test',
      data: {
        email: 'test@mail.com',
        id: Guid.create().toString(),
        firstName: 'test',
        lastName: 'test',
        middleName: 'test',
        role: 'test',
        password: 'test',
      },
    };
    const action: fromAction.LoginUserSuccess = {
      type: fromAction.ActionTypes.LOGIN_USER_SUCCESS,
      payload: [transId, mockData],
    };
    const result = fromReducer.reducer(state, action);
    const expected = {
      ...state,
      user: mockData.data,
      isLoading: new Map([[transId, false]]),
    };

    expect(result).toEqual(expected);
  });
});
