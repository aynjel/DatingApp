import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./components/users-list/users-list').then((m) => m.UsersList),
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
];
