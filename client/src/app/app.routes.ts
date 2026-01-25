import { Routes } from '@angular/router';
import { adminGuard } from './shared/guards/admin.guard';
import { authGuard } from './shared/guards/auth.guard';

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
    canActivate: [authGuard],
  },
  {
    path: 'members',
    loadChildren: () =>
      import('./modules/member-match/member-match.routes').then(
        (m) => m.routes,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'people',
    loadChildren: () =>
      import('./modules/people/people.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('./modules/message/message.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/settings/settings.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.routes').then((m) => m.routes),
    canActivate: [adminGuard, authGuard],
  },
  {
    path: 'errors',
    loadComponent: () =>
      import('./shared/pages/test-errors/test-errors.component').then(
        (m) => m.TestErrorsComponent,
      ),
    title: 'Test Errors',
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./shared/pages/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent,
      ),
    title: 'Server Error',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: 'Page Not Found',
  },
];
