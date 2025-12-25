import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'matches',
    pathMatch: 'full',
  },
  {
    path: 'matches',
    loadComponent: () =>
      import('./pages/matches/matches.component').then(
        (m) => m.MatchesComponent
      ),
    title: 'Matches',
  },
];
