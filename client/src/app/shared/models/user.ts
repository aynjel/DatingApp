export type User = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
};

export type UserRole = 'admin' | 'user';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}
