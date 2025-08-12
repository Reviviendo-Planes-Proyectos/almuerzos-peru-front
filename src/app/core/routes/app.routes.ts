import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home-restaurant',
    pathMatch: 'full'
  },
  {
    path: 'home-restaurant',
    loadComponent: () =>
      import('../../features/landings/landing-restaurant/landing-restaurant.component').then((m) => m.LandingComponent)
  },
  {
    path: 'home-diner',
    loadComponent: () =>
      import('../../features/landings/landing-diner/landing-diner.component').then((m) => m.LandingDinerComponent)
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
    path: '**',
    redirectTo: 'home-restaurant'
  }
];
