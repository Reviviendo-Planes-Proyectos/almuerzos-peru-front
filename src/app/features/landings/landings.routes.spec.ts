import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { landingsRoutes } from './landings.routes';

@Component({
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: []
})
class TestComponent {}

describe('LandingsRoutes', () => {
  let _router: Router;
  let _location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideRouter(landingsRoutes)]
    }).compileComponents();

    _router = TestBed.inject(Router);
    _location = TestBed.inject(Location);
  });

  it('should create routes', () => {
    expect(landingsRoutes).toBeDefined();
    expect(landingsRoutes.length).toBe(3);
  });

  it('should redirect empty path to restaurant', () => {
    const redirectRoute = landingsRoutes[0];

    expect(redirectRoute.path).toBe('');
    expect(redirectRoute.redirectTo).toBe('home-restaurant');
    expect(redirectRoute.pathMatch).toBe('full');
  });

  it('should have diner route configuration', () => {
    const dinerRoute = landingsRoutes[1];
    const dinerData = dinerRoute.data as any;

    expect(dinerRoute.path).toBe('home-diner');
    expect(dinerRoute.title).toBe('Almuerza Perú - Encuentra los mejores menús cerca de ti');
    expect(dinerRoute.loadComponent).toBeDefined();
    expect(dinerData?.preload).toBe(true);
    expect(dinerData?.animation).toBe('fadeIn');
  });

  it('should have restaurant route configuration', () => {
    const restaurantRoute = landingsRoutes[2];
    const restaurantData = restaurantRoute.data as any;

    expect(restaurantRoute.path).toBe('home-restaurant');
    expect(restaurantRoute.title).toBe('Almuerza Perú - Haz crecer tu restaurante');
    expect(restaurantRoute.loadComponent).toBeDefined();
    expect(restaurantData?.preload).toBe(true);
    expect(restaurantData?.animation).toBe('fadeIn');
  });

  it('should have proper SEO metadata for diner', () => {
    const dinerRoute = landingsRoutes[1];
    const dinerData = dinerRoute.data as any;

    expect(dinerData?.description).toContain('Descubre restaurantes locales');
    expect(dinerData?.keywords).toContain('almuerzo');
    expect(dinerData?.keywords).toContain('comida');
    expect(dinerData?.keywords).toContain('delivery');
  });

  it('should have proper SEO metadata for restaurant', () => {
    const restaurantRoute = landingsRoutes[2];
    const restaurantData = restaurantRoute.data as any;

    expect(restaurantData?.description).toContain('Únete a nuestra plataforma');
    expect(restaurantData?.keywords).toContain('restaurante');
    expect(restaurantData?.keywords).toContain('negocio');
    expect(restaurantData?.keywords).toContain('gestión');
  });

  it('should load diner component lazily', () => {
    const dinerRoute = landingsRoutes[1];

    expect(dinerRoute.loadComponent).toBeDefined();
    expect(typeof dinerRoute.loadComponent).toBe('function');
  });

  it('should load restaurant component lazily', () => {
    const restaurantRoute = landingsRoutes[2];

    expect(restaurantRoute.loadComponent).toBeDefined();
    expect(typeof restaurantRoute.loadComponent).toBe('function');
  });

  it('should have navigation configuration', () => {
    expect(landingsRoutes[0].redirectTo).toBe('home-restaurant');
    expect(landingsRoutes[1].path).toBe('home-diner');
    expect(landingsRoutes[2].path).toBe('home-restaurant');

    expect(landingsRoutes[1].title).toBeTruthy();
    expect(landingsRoutes[2].title).toBeTruthy();
  });

  it('should have performance optimizations', () => {
    const dinerRoute = landingsRoutes[1];
    const restaurantRoute = landingsRoutes[2];
    const dinerData = dinerRoute.data as any;
    const restaurantData = restaurantRoute.data as any;

    expect(dinerData?.preload).toBe(true);
    expect(restaurantData?.preload).toBe(true);

    expect(dinerRoute.loadComponent).toBeDefined();
    expect(restaurantRoute.loadComponent).toBeDefined();

    expect(dinerData?.animation).toBe('fadeIn');
    expect(restaurantData?.animation).toBe('fadeIn');
  });
});
