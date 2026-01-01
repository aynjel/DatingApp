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
    path: 'members',
    loadChildren: () =>
      import('./modules/member-match/member-match.routes').then(
        (m) => m.routes
      ),
    canActivate: [childAuthGuard],
  },
  {
    path: 'people',
    loadChildren: () =>
      import('./modules/people/people.routes').then((m) => m.routes),
    canActivate: [childAuthGuard],
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('./modules/message/message.routes').then((m) => m.routes),
    canActivate: [childAuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/settings/settings.routes').then((m) => m.routes),
    canActivate: [childAuthGuard],
  },
  {
    path: 'errors',
    loadComponent: () =>
      import('./shared/pages/test-errors/test-errors.component').then(
        (m) => m.TestErrorsComponent
      ),
    title: 'Test Errors',
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./shared/pages/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent
      ),
    title: 'Server Error',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Page Not Found',
  },
];
