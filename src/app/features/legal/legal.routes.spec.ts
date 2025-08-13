import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { LEGAL_ROUTES } from './legal.routes';

@Component({
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
class TestComponent {}

describe('LEGAL_ROUTES', () => {
  let router: Router;
  let location: Location;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideRouter([
          { path: 'legal', children: LEGAL_ROUTES },
          { path: '', redirectTo: '/legal', pathMatch: 'full' }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should have legal routes defined', () => {
    expect(LEGAL_ROUTES).toBeDefined();
    expect(LEGAL_ROUTES.length).toBe(2);
  });

  it('should have terms-and-conditions route', () => {
    const terminosRoute = LEGAL_ROUTES.find((route) => route.path === 'terms-and-conditions');
    expect(terminosRoute).toBeDefined();
    expect(terminosRoute?.loadComponent).toBeDefined();
  });

  it('should have privacy-policy route', () => {
    const privacyRoute = LEGAL_ROUTES.find((route) => route.path === 'privacy-policy');
    expect(privacyRoute).toBeDefined();
    expect(privacyRoute?.loadComponent).toBeDefined();
  });

  it('should load TerminosCondicionesComponent when navigating to terms-and-conditions', async () => {
    const terminosRoute = LEGAL_ROUTES.find((route) => route.path === 'terms-and-conditions');

    if (terminosRoute?.loadComponent) {
      const component = await terminosRoute.loadComponent();
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    }
  });

  it('should load PrivacyPolicyComponent when navigating to privacy-policy', async () => {
    const privacyRoute = LEGAL_ROUTES.find((route) => route.path === 'privacy-policy');

    if (privacyRoute?.loadComponent) {
      const component = await privacyRoute.loadComponent();
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    }
  });

  it('should navigate to terms-and-conditions route', async () => {
    await router.navigate(['/legal/terms-and-conditions']);
    expect(location.path()).toBe('/legal/terms-and-conditions');
  });

  it('should navigate to privacy-policy route', async () => {
    await router.navigate(['/legal/privacy-policy']);
    expect(location.path()).toBe('/legal/privacy-policy');
  });
});
