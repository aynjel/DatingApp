import { User } from '../../user';

export interface RegisterUserRequest extends Omit<User, 'userId' | 'role'> {
  password: string;
  confirmPassword: string;
}
