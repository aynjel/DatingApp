import { HttpErrorResponse } from '@angular/common/http';

export type NgrxError = {
  concern: string;
  error: HttpErrorResponse;
};

export type FailurePayload<T> = {
  concern: T;
  error: HttpErrorResponse;
};
