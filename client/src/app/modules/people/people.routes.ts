import { Routes } from '@angular/router';
import { memberDetailResolver } from './resolvers/member-detail.resolver';

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
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/details/details.component').then(
        (m) => m.MemberDetailsComponent
      ),
    resolve: {
      member: memberDetailResolver,
    },
    title: 'Member Details',
  },
];
