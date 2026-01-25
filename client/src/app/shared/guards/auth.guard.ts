import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateChildFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  if (!authStore.isLoggedIn()) {
    authStore.toastService.show('You must be logged in to access this page.');
    router.navigate(['/home']);
    return false;
  }
  return true;
};
