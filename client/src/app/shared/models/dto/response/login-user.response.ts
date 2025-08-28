import { TokenResponse } from '../../common-models';
import { User } from '../../user';

export interface LoginUserResponse extends User {
  name: string;
  token: TokenResponse;
}
