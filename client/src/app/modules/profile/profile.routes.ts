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
];
