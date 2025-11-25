import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../modules/auth/store/auth.store';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const modifiedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authStore.accessToken() ?? ''}`,
    },
  });
  return next(modifiedRequest);
};
