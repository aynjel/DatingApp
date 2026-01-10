export interface RegisterUserRequest {
  displayName: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: Date;
  description: string;
  interests: string[];
  city: string;
  country: string;
}
