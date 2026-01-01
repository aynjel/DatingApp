import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full',
  },
  {
    path: 'inbox',
    loadComponent: () =>
      import('./pages/inbox/inbox.component').then((m) => m.InboxComponent),
    title: 'Inbox',
  },
  {
    path: 'thread/:id',
    loadComponent: () =>
      import('./pages/inbox/inbox.component').then((m) => m.InboxComponent),
    title: 'Conversation',
  },
];
