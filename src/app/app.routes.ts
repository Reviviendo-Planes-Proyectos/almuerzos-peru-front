import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },
];
