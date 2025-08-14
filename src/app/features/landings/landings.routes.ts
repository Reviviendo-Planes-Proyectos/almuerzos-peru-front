import { Routes } from '@angular/router';

export const landingsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home-restaurant',
    pathMatch: 'full'
  },
  {
    path: 'home-diner',
    loadComponent: () => import('./pages/landing-diner/landing-diner.component').then((m) => m.LandingDinerComponent),
    title: 'Almuerza Perú - Encuentra los mejores menús cerca de ti',
    data: {
      description:
        'Descubre restaurantes locales y sus menús diarios. Encuentra opciones deliciosas y convenientes cerca de tu ubicación.',
      keywords: 'almuerzo, comida, restaurantes, menús, delivery, Perú',
      preload: true,
      animation: 'fadeIn'
    }
  },
  {
    path: 'home-restaurant',
    loadComponent: () =>
      import('./pages/landing-restaurant/landing-restaurant.component').then((m) => m.LandingComponent),
    title: 'Almuerza Perú - Haz crecer tu restaurante',
    data: {
      description:
        'Únete a nuestra plataforma y haz que más clientes descubran tu restaurante. Gestiona tus menús y aumenta tus ventas.',
      keywords: 'restaurante, negocio, menús, ventas, gestión, plataforma',
      preload: true,
      animation: 'fadeIn'
    }
  }
];
