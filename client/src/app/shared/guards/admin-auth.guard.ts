import { CanActivateFn } from '@angular/router';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  // const router = inject(Router);

  // if (authService.role() === UserRoleEnum.ADMIN) {
  //   return true;
  // }

  // router.navigate(['/']);
  return true;
};
