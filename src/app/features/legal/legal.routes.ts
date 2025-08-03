import { Routes } from '@angular/router';

export const LEGAL_ROUTES: Routes = [
  {
    path: 'terminos-condiciones',
    loadComponent: () =>
      import('./components/terminos-condiciones/terminos-condiciones.component').then(
        (m) => m.TerminosCondicionesComponent
      )
  },
  {
    path: 'politica-privacidad',
    loadComponent: () =>
      import('./components/politica-privacidad/politica-privacidad.component').then(
        (m) => m.PoliticaPrivacidadComponent
      )
  }
];
