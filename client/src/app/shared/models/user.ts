export type User = {
  userId: string;
  displayName: string;
  email: string;
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
