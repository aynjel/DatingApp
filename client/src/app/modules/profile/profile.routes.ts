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
    path: 'member-details/:id',
    loadComponent: () =>
      import('./pages/member-details/member-details.component').then(
        (m) => m.MemberDetailsComponent
      ),
    title: 'Member Profile',
  },
];
