import { CanActivateChildFn } from '@angular/router';

export const childAuthGuard: CanActivateChildFn = () => {
  // const authService = inject(AuthService);
  // const toastService = inject(ToastService);
  // const router = inject(Router);

  // if (!authService.isLoggedIn()) {
  //   toastService.show('You must be logged in to access this page.');
  //   router.navigate(['/home']);
  // }

  return true;
};
