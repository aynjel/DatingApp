import { Routes } from '@angular/router';
import { MessageComponent } from './pages/message/message.component';

export const routes: Routes = [
  {
    path: '',
    component: MessageComponent,
    children: [
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
        path: 'inbox/:recipientId',
        loadComponent: () =>
          import('./pages/inbox/inbox.component').then((m) => m.InboxComponent),
        title: 'Inbox',
      },
      {
        path: 'outbox',
        loadComponent: () =>
          import('./pages/outbox/outbox.component').then(
            (m) => m.OutboxComponent,
          ),
        title: 'Outbox',
      },
    ],
  },
];
