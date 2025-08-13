import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent)
  },
  {
    path: 'profile-selection',
    loadComponent: () =>
      import('./pages/profile-selection/profile-selection.component').then((m) => m.ProfileSelectionComponent)
  },
  {
    path: 'email-sent-confirmation',
    loadComponent: () =>
      import('./pages/email-sent-confirmation/email-sent-confirmation.component').then(
        (m) => m.EmailSentConfirmationComponent
      )
  },
  {
    path: 'customer-basic-info',
    loadComponent: () =>
      import('./pages/customer-basic-info/customer-basic-info.component').then((m) => m.CustomerBasicInfoComponent)
  },
  {
    path: 'email-verification',
    loadComponent: () =>
      import('./pages/email-verification/email-verification.component').then((m) => m.EmailVerificationComponent)
  },
  {
    path: 'email-verification/:email',
    loadComponent: () =>
      import('./pages/email-verification/email-verification.component').then((m) => m.EmailVerificationComponent)
  },
  {
    path: 'customer-profile-photo',
    loadComponent: () =>
      import('./pages/customer-profile-photo/customer-profile-photo.component').then(
        (m) => m.CustomerProfilePhotoComponent
      )
  },
  {
    path: 'restaurant-basic-info',
    loadComponent: () =>
      import('./pages/restaurant-basic-info/restaurant-basic-info.component').then(
        (m) => m.RestaurantBasicInfoComponent
      )
  },
  {
    path: 'phone-verification',
    loadComponent: () =>
      import('./pages/phone-verification/phone-verification.component').then((m) => m.PhoneVerificationComponent)
  },
  {
    path: 'restaurant-profile-photo',
    loadComponent: () =>
      import('./pages/restaurant-profile-photo/restaurant-profile-photo.component').then(
        (m) => m.RestaurantProfilePhotoComponent
      )
  },
  {
    path: 'restaurant-schedule',
    loadComponent: () =>
      import('./pages/restaurant-schedule/restaurant-schedule.component').then((m) => m.RestaurantScheduleComponent)
  }
];
