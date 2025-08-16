import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/components/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/components/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent)
  },
  {
    path: 'profile-selection',
    loadComponent: () =>
      import('./pages/components/profile-selection/profile-selection.component').then(
        (m) => m.ProfileSelectionComponent
      )
  },
  {
    path: 'email-sent-confirmation',
    loadComponent: () =>
      import('./pages/components/email-sent-confirmation/email-sent-confirmation.component').then(
        (m) => m.EmailSentConfirmationComponent
      )
  },
  {
    path: 'email-verification',
    loadComponent: () =>
      import('./pages/components/email-verification/email-verification.component').then(
        (m) => m.EmailVerificationComponent
      )
  },
  {
    path: 'email-verification/:email',
    loadComponent: () =>
      import('./pages/components/email-verification/email-verification.component').then(
        (m) => m.EmailVerificationComponent
      )
  },
  {
    path: 'phone-verification',
    loadComponent: () =>
      import('./pages/components/phone-verification/phone-verification.component').then(
        (m) => m.PhoneVerificationComponent
      )
  },
  {
    path: 'customer-basic-info',
    loadComponent: () =>
      import('./pages/customer/customer-basic-info/customer-basic-info.component').then(
        (m) => m.CustomerBasicInfoComponent
      )
  },
  {
    path: 'customer-profile-photo',
    loadComponent: () =>
      import('./pages/customer/customer-profile-photo/customer-profile-photo.component').then(
        (m) => m.CustomerProfilePhotoComponent
      )
  },
  {
    path: 'restaurant-basic-info',
    loadComponent: () =>
      import('./pages/restaurant/restaurant-basic-info/restaurant-basic-info.component').then(
        (m) => m.RestaurantBasicInfoComponent
      )
  },
  {
    path: 'restaurant-profile-photo',
    loadComponent: () =>
      import('./pages/restaurant/restaurant-profile-photo/restaurant-profile-photo.component').then(
        (m) => m.RestaurantProfilePhotoComponent
      )
  },
  {
    path: 'restaurant-schedule',
    loadComponent: () =>
      import('./pages/restaurant/restaurant-schedule/restaurant-schedule.component').then(
        (m) => m.RestaurantScheduleComponent
      )
  },
  {
    path: 'restaurant-social-networks',
    loadComponent: () =>
      import('./pages/restaurant-social-networks/restaurant-social-networks.component').then(
        (m) => m.RestaurantSocialNetworksComponent
      )
  }
];
