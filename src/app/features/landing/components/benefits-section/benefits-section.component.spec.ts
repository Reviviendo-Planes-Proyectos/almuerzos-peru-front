import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BenefitsSectionComponent } from './benefits-section.component';

describe('BenefitsSectionComponent', () => {
  let component: BenefitsSectionComponent;
  let fixture: ComponentFixture<BenefitsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsSectionComponent]
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
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(component.benefits.length);
  });
});
