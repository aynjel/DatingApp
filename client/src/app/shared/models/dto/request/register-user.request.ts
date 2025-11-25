import { User } from '../../user.model';

export interface RegisterUserRequest extends Omit<User, 'userId' | 'role'> {
  password: string;
  confirmPassword: string;
}
