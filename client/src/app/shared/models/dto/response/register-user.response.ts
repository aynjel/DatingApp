import { User } from '../../user';

export interface RegisterUserResponse extends User {
  token: string;
}
