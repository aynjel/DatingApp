import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { ServerError } from './pages/server-error/server-error';
import { TestErrors } from './pages/test-errors/test-errors';
import { childAuthGuard } from './shared/guards/child-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/profile/profile.routes').then((m) => m.routes),
    canActivate: [childAuthGuard],
  },
  {
    path: 'portal',
    canActivate: [childAuthGuard],
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
    path: 'server-error',
    component: ServerError,
    title: 'Server Error',
  },
  {
    path: '**',
    component: NotFound,
    title: 'Page Not Found',
  },
];
