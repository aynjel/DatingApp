import { TUser } from '../common.types';

export type LoginRequest = Pick<TUser, 'email' | 'password'>;

export type RegisterRequest = Pick<
  TUser,
  'email' | 'password' | 'firstName' | 'middleName' | 'lastName'
>;
