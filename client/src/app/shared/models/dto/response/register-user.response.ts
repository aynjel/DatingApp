import { TokenResponse } from '../../common-models';

export interface RegisterUserResponse {
  displayName: string;
  token: TokenResponse;
}
