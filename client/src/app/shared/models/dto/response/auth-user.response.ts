import { TokenResponse } from '../../common-models';

export interface AuthUserResponse {
  displayName: string;
  token: TokenResponse;
}
