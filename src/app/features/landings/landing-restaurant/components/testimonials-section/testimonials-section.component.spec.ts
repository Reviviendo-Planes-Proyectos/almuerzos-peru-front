import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialsSectionComponent } from './testimonials-section.component';

describe('TestimonialsSectionComponent', () => {
  let component: TestimonialsSectionComponent;
  let fixture: ComponentFixture<TestimonialsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsSectionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the testimonials section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section#testimonios');
    expect(section).toBeTruthy();
    expect(section?.textContent).toContain('Clientes');
  });

  it('should render 3 testimonials', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(3);
  });

  it('should render correct rating icons per testimonial', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ratings = component.testimonials.map((t) => t.rating);
    const iconRows = compiled.querySelectorAll('.rating');

    iconRows.forEach((row, i) => {
      const stars = row.querySelectorAll('mat-icon');
      expect(stars.length).toBe(ratings[i]);
    });
  });
});
