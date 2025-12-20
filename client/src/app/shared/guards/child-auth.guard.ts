import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthStore } from '../../modules/auth/store/auth.store';
import { ToastService } from '../services/toast.service';

export const childAuthGuard: CanActivateChildFn = (route, state) => {
  const authStore = inject(AuthStore);
  const toastService = inject(ToastService);
  const router = inject(Router);
  if (!authStore.isLoggedIn()) {
    toastService.show('You must be logged in to access this page.');
    router.navigate(['/home']);
    return false;
  }
  return true;
};
