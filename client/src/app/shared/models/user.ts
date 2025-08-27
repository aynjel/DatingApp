export type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type UserRole = 'admin' | 'user' | 'guest';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}
