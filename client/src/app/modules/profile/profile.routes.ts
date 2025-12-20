import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'me',
    pathMatch: 'full',
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'Profile Details',
  },
  {
    path: 'account-settings',
    loadComponent: () =>
      import('./pages/account-settings/account-settings.component').then(
        (m) => m.AccountSettingsComponent
      ),
    title: 'Account Settings',
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./pages/edit-profile/edit-profile.component').then(
        (m) => m.EditProfileComponent
      ),
    title: 'Edit Profile',
  },
];
