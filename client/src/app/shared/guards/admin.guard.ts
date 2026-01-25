import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);

  if (
    authStore.roles().includes('Admin') ||
    authStore.roles().includes('Moderator')
  ) {
    return true;
  }

  authStore.toastService.show('Access denied. Admins only.', 'error');
  return false;
};
