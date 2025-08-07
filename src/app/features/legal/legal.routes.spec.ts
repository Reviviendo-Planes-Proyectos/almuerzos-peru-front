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

  it('should have terminos-condiciones route', () => {
    const terminosRoute = LEGAL_ROUTES.find((route) => route.path === 'terminos-condiciones');
    expect(terminosRoute).toBeDefined();
    expect(terminosRoute?.loadComponent).toBeDefined();
  });

  it('should have politica-privacidad route', () => {
    const politicaRoute = LEGAL_ROUTES.find((route) => route.path === 'politica-privacidad');
    expect(politicaRoute).toBeDefined();
    expect(politicaRoute?.loadComponent).toBeDefined();
  });

  it('should load TerminosCondicionesComponent when navigating to terminos-condiciones', async () => {
    const terminosRoute = LEGAL_ROUTES.find((route) => route.path === 'terminos-condiciones');

    if (terminosRoute?.loadComponent) {
      const component = await terminosRoute.loadComponent();
      expect(component).toBeDefined();
      // Verificar que el componente tiene las propiedades esperadas
      expect(typeof component).toBe('function');
    }
  });

  it('should load PoliticaPrivacidadComponent when navigating to politica-privacidad', async () => {
    const politicaRoute = LEGAL_ROUTES.find((route) => route.path === 'politica-privacidad');

    if (politicaRoute?.loadComponent) {
      const component = await politicaRoute.loadComponent();
      expect(component).toBeDefined();
      // Verificar que el componente tiene las propiedades esperadas
      expect(typeof component).toBe('function');
    }
  });

  it('should navigate to terminos-condiciones route', async () => {
    await router.navigate(['/legal/terminos-condiciones']);
    expect(location.path()).toBe('/legal/terminos-condiciones');
  });

  it('should navigate to politica-privacidad route', async () => {
    await router.navigate(['/legal/politica-privacidad']);
    expect(location.path()).toBe('/legal/politica-privacidad');
  });
});
