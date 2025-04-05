import { TUser } from '../common.types';

export type LoginRequest = Pick<TUser, 'username' | 'password'>;

export type RegisterRequest = Pick<
  TUser,
  'username' | 'password' | 'firstName' | 'middleName' | 'lastName'
>;
