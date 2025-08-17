import { User } from '../../user';

export interface RegisterUserRequest extends Omit<User, 'id' | 'role'> {
  password: string;
  confirmPassword: string;
}
