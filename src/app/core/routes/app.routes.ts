import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('../../features/landing/landing.component').then((m) => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('../../features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'legal',
    loadChildren: () => import('../../features/legal/legal.routes').then((m) => m.LEGAL_ROUTES)
  }
];
