import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { PricingSectionComponent } from './pricing-section.component';

describe('PricingSectionComponent', () => {
  let component: PricingSectionComponent;
  let fixture: ComponentFixture<PricingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingSectionComponent], // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(PricingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the section title and subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Planes que se Adaptan');
    expect(compiled.querySelector('p')?.textContent).toContain('Elige el plan perfecto');
  });

  it('should render two pricing cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const plans = compiled.querySelectorAll('.rounded-2xl');
    expect(plans.length).toBe(2);
  });

  it('should render correct features per plan', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featureLists = compiled.querySelectorAll('ul');
    expect(featureLists.length).toBe(2);

    const freePlanFeatures = featureLists[0].querySelectorAll('li');
    const premiumPlanFeatures = featureLists[1].querySelectorAll('li');

    expect(freePlanFeatures.length).toBe(5);
    expect(premiumPlanFeatures.length).toBe(6);
  });

  it('should mark the premium plan as popular', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const popularBadge = compiled.querySelector('span.bg-gradient-to-r');
    expect(popularBadge?.textContent).toContain('Más Popular');
  });

  it('should render correct button labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Comenzar Gratis');
    expect(buttons[1].textContent).toContain('Comenzar Premium');
  });
});
