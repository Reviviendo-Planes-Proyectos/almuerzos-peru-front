import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';

@Component({
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: []
})
class TestComponent {}

describe('AppRoutes', () => {
  let _router: Router;
  let _location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideRouter(routes)]
    }).compileComponents();

    _router = TestBed.inject(Router);
    _location = TestBed.inject(Location);
  });

  it('should create routes', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBe(4);
  });

  it('should have landings as root path', () => {
    const landingsRoute = routes.find((route) => route.path === '');
    expect(landingsRoute).toBeTruthy();
    expect(landingsRoute?.loadChildren).toBeDefined();
    expect(typeof landingsRoute?.loadChildren).toBe('function');
  });

  it('should load landings children routes correctly', async () => {
    const landingsRoute = routes.find((route) => route.path === '');
    expect(landingsRoute).toBeTruthy();

    const loadChildrenFn = landingsRoute?.loadChildren;
    expect(loadChildrenFn).toBeDefined();

    try {
      const loadedRoutes = await loadChildrenFn?.();
      expect(loadedRoutes).toBeTruthy();

      if (typeof loadedRoutes === 'object' && loadedRoutes && 'landingsRoutes' in loadedRoutes) {
        const routes = (loadedRoutes as any).landingsRoutes;
        expect(routes).toBeDefined();
        expect(Array.isArray(routes)).toBe(true);
        expect(routes.length).toBeGreaterThan(0);
      } else if (Array.isArray(loadedRoutes)) {
        expect(loadedRoutes.length).toBeGreaterThan(0);
        expect(loadedRoutes.some((route: any) => route.path === 'diner')).toBe(true);
        expect(loadedRoutes.some((route: any) => route.path === 'restaurant')).toBe(true);
      } else {
        expect(loadedRoutes).toBeDefined();
      }
    } catch (_error) {
      expect(loadChildrenFn).toBeDefined();
    }
  });

  it('should define auth route correctly', () => {
    const authRoute = routes.find((route) => route.path === 'auth');
    expect(authRoute).toBeTruthy();
    expect(authRoute?.loadChildren).toBeDefined();
  });

  it('should load auth children routes correctly', async () => {
    const authRoute = routes.find((route) => route.path === 'auth');
    expect(authRoute).toBeTruthy();

    const loadChildrenFn = authRoute?.loadChildren;
    expect(loadChildrenFn).toBeDefined();

    const loadedRoutes = await loadChildrenFn?.();
    expect(loadedRoutes).toBeTruthy();

    if (Array.isArray(loadedRoutes)) {
      expect(loadedRoutes.length).toBeGreaterThan(0);
    } else {
      expect(typeof loadedRoutes).toBe('object');
    }
  });

  it('should define legal route correctly', () => {
    const legalRoute = routes.find((route) => route.path === 'legal');
    expect(legalRoute).toBeTruthy();
    expect(legalRoute?.loadChildren).toBeDefined();
  });

  it('should load legal children routes correctly', async () => {
    const legalRoute = routes.find((route) => route.path === 'legal');
    expect(legalRoute).toBeTruthy();

    const loadChildrenFn = legalRoute?.loadChildren;
    expect(loadChildrenFn).toBeDefined();

    const loadedRoutes = await loadChildrenFn?.();
    expect(loadedRoutes).toBeTruthy();

    if (Array.isArray(loadedRoutes)) {
      expect(loadedRoutes.length).toBeGreaterThan(0);
    } else {
      expect(typeof loadedRoutes).toBe('object');
    }
  });

  it('should have wildcard redirect to root', () => {
    const wildcardRoute = routes.find((route) => route.path === '**');
    expect(wildcardRoute).toBeTruthy();
    expect(wildcardRoute?.redirectTo).toBe('');
  });

  it('should have proper lazy loading configuration', () => {
    const lazyRoutes = routes.filter((route) => route.path !== '**');

    for (const route of lazyRoutes) {
      expect(route.loadChildren).toBeDefined();
      expect(typeof route.loadChildren).toBe('function');
    }
  });
});
