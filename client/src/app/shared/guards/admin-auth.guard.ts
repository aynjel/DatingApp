import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoleEnum } from '@model/user';
import { Auth } from '@service/auth';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.getRole() === UserRoleEnum.ADMIN) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
