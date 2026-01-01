export enum APIEndpoints {
  CURRENT_USER = '/account/current-user',
  LOGIN = '/account/login',
  REGISTER = '/account/register',
  REFRESH_TOKEN = '/account/refresh-token',
  FORGOT_PASSWORD = '/account/forgot-password',
  MESSAGES = '/messages',
}

export enum ErrorEndpoints {
  TEST = 'test',
  NOT_FOUND = 'not-found',
  SERVER_ERROR = 'server-error',
  UNAUTHORIZED = 'unauthorized',
  BAD_REQUEST = 'bad-request',
  REGISTER = 'register',
}
