import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '../../../shared/store/auth.store';

export const memberDetailsSetupGuard: CanActivateFn = (route, state) => {
  console.log('memberDetailsSetupGuard');
  const authStore = inject(AuthStore);
  if (!authStore.currentUser()?.memberDetails) {
    return true;
  }
  return false;
};
