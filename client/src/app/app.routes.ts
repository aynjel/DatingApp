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
    ],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users-list/users-list').then((m) => m.UsersList),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./pages/user-details/user-details').then((m) => m.UserDetails),
  },
  {
    path: 'lists',
    loadComponent: () => import('./pages/lists/lists').then((m) => m.Lists),
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./pages/messages/messages').then((m) => m.Messages),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
