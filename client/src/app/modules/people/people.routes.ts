import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lists',
    pathMatch: 'full',
  },
  {
    path: 'lists',
    loadComponent: () =>
      import('./pages/lists/lists.component').then((m) => m.ListsComponent),
    title: 'People Lists',
  },
];
