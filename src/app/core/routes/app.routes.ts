import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../../features/landings/landings.routes').then((m) => m.landingsRoutes)
  },
  {
    path: 'auth',
    loadChildren: () => import('../../features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'legal',
    loadChildren: () => import('../../features/legal/legal.routes').then((m) => m.LEGAL_ROUTES)
  },
  {
    path: 'home',
    loadChildren: () => import('../../features/home/home.routes').then((m) => m.HOME_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
