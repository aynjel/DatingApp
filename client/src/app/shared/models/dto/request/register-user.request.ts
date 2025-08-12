import { User } from '../../user';

export interface RegisterUserRequest extends Omit<User, 'id'> {
  password: string;
  confirmPassword: string;
}
