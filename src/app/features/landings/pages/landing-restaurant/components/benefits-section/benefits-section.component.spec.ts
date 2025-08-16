import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18N_TEST_PROVIDERS } from '../../../../../../testing/pwa-mocks';
import { BenefitsSectionComponent } from './benefits-section.component';

describe('BenefitsSectionComponent', () => {
  let component: BenefitsSectionComponent;
  let fixture: ComponentFixture<BenefitsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsSectionComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), ...I18N_TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(BenefitsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the benefits section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section#beneficios')).toBeTruthy();
  });

  it('should display the gradient text "Transforman"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.gradient-text');
    expect(titleElement?.textContent).toContain('Transforman');
  });

  it('should render all defined benefits', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const benefitCards = compiled.querySelectorAll('.bg-white.p-4.rounded-lg.shadow-lg');
    expect(benefitCards.length).toBe(component.benefits.length);
  });
});
