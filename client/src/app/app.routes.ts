import { Routes } from '@angular/router';
import { TestErrors } from './pages/test-errors/test-errors';
import { childAuthGuard } from './shared/guards/child-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dating-app',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Home',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-form/register-form').then((m) => m.RegisterForm),
    title: 'Register',
  },
  {
    path: 'portal',
    canActivate: [childAuthGuard],
    title: 'Portal',
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users-list/users-list').then((m) => m.UsersList),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./pages/user-details/user-details').then(
            (m) => m.UserDetails
          ),
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
    ],
  },
  {
    path: 'errors',
    component: TestErrors,
    title: 'Test Errors',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
