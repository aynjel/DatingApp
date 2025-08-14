import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { Auth } from '@service/auth';

export const childAuthGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(Auth);

  return authService.isAuthenticated();
};
