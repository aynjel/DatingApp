import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastService } from '../services/toast.service';

export const childAuthGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    toastService.show('You must be logged in to access this page.');
    router.navigate(['/home']);
  }

  return authService.isLoggedIn();
};
