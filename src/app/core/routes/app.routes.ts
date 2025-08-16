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
    path: 'pwa-debug',
    loadComponent: () => import('../../shared/components/debug/pwa-debug.component').then((c) => c.PwaDebugComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
