export type TUser = {
  id: string;
  username: string;
  password: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  role: string;
};

export type ApiResponse<T> = {
  data: T;
  error: string;
};
