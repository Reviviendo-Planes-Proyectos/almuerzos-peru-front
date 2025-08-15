import { Routes } from '@angular/router';

export const LEGAL_ROUTES: Routes = [
  {
    path: 'terms-and-conditions',
    loadComponent: () =>
      import('./pages/terms-and-conditions/terms-and-conditions.component').then((m) => m.TermsAndConditionsComponent)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicyComponent)
  }
];
