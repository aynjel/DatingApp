export type TUser = {
  id: string;
  email: string;
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
