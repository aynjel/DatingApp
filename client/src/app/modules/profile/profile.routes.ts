import { Routes } from '@angular/router';
import { memberResolver } from './resolvers/member.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'me',
    pathMatch: 'full',
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'Profile Details',
  },
  {
    path: 'member-details/:id',
    loadComponent: () =>
      import('./pages/member-details/member-details.component').then(
        (m) => m.MemberDetailsComponent
      ),
    title: 'Member Profile',
    resolve: { member: memberResolver },
  },
];
