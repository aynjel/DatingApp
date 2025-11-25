import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoleEnum } from '@model/user';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.role() === UserRoleEnum.ADMIN) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
