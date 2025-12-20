import { Routes } from '@angular/router';
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
      import('./modules/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.authRoutes),
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
          import('./pages/users-list/users-list.component').then(
            (m) => m.UsersListComponent
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./pages/user-details/user-details.component').then(
            (m) => m.UserDetailsComponent
          ),
      },
      {
        path: 'lists',
        loadComponent: () =>
          import('./pages/lists/lists.component').then((m) => m.ListsComponent),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/messages/messages.component').then(
            (m) => m.MessagesComponent
          ),
      },
    ],
  },
  {
    path: 'errors',
    loadComponent: () =>
      import('./pages/test-errors/test-errors.component').then(
        (m) => m.TestErrorsComponent
      ),
    title: 'Test Errors',
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./pages/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent
      ),
    title: 'Server Error',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Page Not Found',
  },
];
