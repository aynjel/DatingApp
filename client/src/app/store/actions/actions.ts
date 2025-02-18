import { Action } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { LoginRequest, RegisterRequest } from '../../types/api/request.models';
import {
  LoginResponse,
  RegisterResponse,
} from '../../types/api/response.models';
import { FailurePayload } from '../../types/error.types';

export enum ActionTypes {
  RESET_STORE = '[Store] RESET_STORE',
  FAILURE = '[Store] FAILURE',
  ERROR_MESSAGE = '[Store] ERROR_MESSAGE',

  LOGIN_USER = '[Store] LOGIN_USER',
  LOGIN_USER_SUCCESS = '[Store] LOGIN_USER_SUCCESS',
  REGISTER_USER = '[Store] REGISTER_USER',
  REGISTER_USER_SUCCESS = '[Store] REGISTER_USER_SUCCESS',
  LOGOUT_USER = '[Store] LOGOUT_USER',
}

export interface IAction extends Action {
  payload: any;
}

export class LoginUser implements IAction {
  readonly type = ActionTypes.LOGIN_USER;
  constructor(public payload: [Guid, LoginRequest]) {}
}

export class LoginUserSuccess implements IAction {
  readonly type = ActionTypes.LOGIN_USER_SUCCESS;
  constructor(public payload: [Guid, LoginResponse]) {}
}

export class RegisterUser implements IAction {
  readonly type = ActionTypes.REGISTER_USER;
  constructor(public payload: [Guid, RegisterRequest]) {}
}

export class RegisterUserSuccess implements IAction {
  readonly type = ActionTypes.REGISTER_USER_SUCCESS;
  constructor(public payload: [Guid, RegisterResponse]) {}
}

export class LogoutUser implements IAction {
  readonly type = ActionTypes.LOGOUT_USER;
  constructor(public payload: void) {}
}

export class ErrorMessage implements IAction {
  readonly type = ActionTypes.ERROR_MESSAGE;
  constructor(public payload: string) {}
}

export class ResetStore implements IAction {
  readonly type = ActionTypes.RESET_STORE;
  constructor(public payload: void) {}
}

export class Failure implements IAction {
  readonly type = ActionTypes.FAILURE;
  constructor(
    public payload: [Guid, FailurePayload<'LOGIN_USER' | 'REGISTER_USER'>]
  ) {}
}

export type ActionTypesUnion =
  | LoginUser
  | LoginUserSuccess
  | RegisterUser
  | RegisterUserSuccess
  | LogoutUser
  | ErrorMessage
  | ResetStore
  | Failure;
