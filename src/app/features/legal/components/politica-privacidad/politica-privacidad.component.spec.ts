import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PoliticaPrivacidadComponent } from './politica-privacidad.component';

describe('PoliticaPrivacidadComponent', () => {
  let component: PoliticaPrivacidadComponent;
  let fixture: ComponentFixture<PoliticaPrivacidadComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
      url: '/legal/politica-privacidad'
    };

    await TestBed.configureTestingModule({
      imports: [PoliticaPrivacidadComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaPrivacidadComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have current date as fechaActualizacion', () => {
    const expectedDate = new Date().toLocaleDateString('es-PE');
    expect(component.fechaActualizacion).toBe(expectedDate);
  });

  it('should navigate to home when volverAlInicio is called', () => {
    component.volverAlInicio();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Política de Privacidad');
  });

  it('should display the update date', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dateElement = compiled.querySelector('p');
    expect(dateElement?.textContent).toContain('Última actualización:');
    expect(dateElement?.textContent).toContain(component.fechaActualizacion);
  });

  it('should navigate to home when volverAlInicio method is called', () => {
    component.volverAlInicio();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
