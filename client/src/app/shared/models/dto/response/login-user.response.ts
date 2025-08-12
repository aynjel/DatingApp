import { User } from '../../user';

export interface LoginUserResponse extends User {
  token: string;
}
