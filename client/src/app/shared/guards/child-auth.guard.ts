import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Auth } from '@service/auth';
import { ToastService } from '../services/toast';

export const childAuthGuard: CanActivateChildFn = () => {
  const authService = inject(Auth);
  const toastService = inject(ToastService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    toastService.show('You must be logged in to access this page.');
    router.navigate(['/home']);
  }

  return authService.isLoggedIn();
};
