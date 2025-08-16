import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { I18nService } from '../../../../shared/i18n';
import { PrivacyPolicyComponent } from './privacy-policy.component';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
      url: '/legal/privacy-policy'
    };

    const activatedRouteSpy = {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    };

    const i18nServiceSpy = {
      t: jest.fn((key: string) => {
        const translations: { [key: string]: string } = {
          'landing.footer.legal.privacy.title': 'Política de Privacidad',
          'landing.footer.legal.lastUpdated': 'Última actualización:'
        };
        return translations[key] || key;
      })
    };

    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: I18nService, useValue: i18nServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
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
});
