import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register-form/register-form').then(
            (m) => m.RegisterForm
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users-list/users-list').then((m) => m.UsersList),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
