import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestimonialsSectionComponent } from './testimonials-section.component';

describe('TestimonialsSectionComponent', () => {
  let component: TestimonialsSectionComponent;
  let fixture: ComponentFixture<TestimonialsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsSectionComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have testimonials data', () => {
    expect(component.testimonials).toBeDefined();
    expect(component.testimonials.length).toBe(3);
  });

  it('should have correct testimonials structure', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial).toHaveProperty('name');
      expect(testimonial).toHaveProperty('role');
      expect(testimonial).toHaveProperty('avatar');
      expect(testimonial).toHaveProperty('rating');
      expect(testimonial).toHaveProperty('text');
    }
  });

  it('should have valid testimonial names', () => {
    const names = component.testimonials.map((t) => t.name);

    expect(names).toContain('Carla Rodríguez');
    expect(names).toContain('Julio Fernández');
    expect(names).toContain('David García');
  });

  it('should have valid ratings for all testimonials', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.rating).toBeGreaterThan(0);
      expect(testimonial.rating).toBeLessThanOrEqual(5);
    }
  });

  it('should have all 5-star ratings', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.rating).toBe(5);
    }
  });

  it('should have valid avatar images', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.avatar).toBeTruthy();
      expect(testimonial.avatar).toContain('/img/landing/');
      expect(testimonial.avatar).toContain('.png');
    }
  });

  it('should have non-empty testimonial texts', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.text).toBeTruthy();
      expect(testimonial.text.length).toBeGreaterThan(10);
    }
  });

  it('should have descriptive roles for testimonials', () => {
    const roles = component.testimonials.map((t) => t.role);

    expect(roles).toContain('29 años, diseñadora gráfica');
    expect(roles).toContain('31 años, técnico en telecomunicaciones');
    expect(roles).toContain('34 años, repartidor');
  });

  describe('getStarArray method', () => {
    it('should return array of correct length', () => {
      expect(component.getStarArray(5)).toHaveLength(5);
      expect(component.getStarArray(3)).toHaveLength(3);
      expect(component.getStarArray(1)).toHaveLength(1);
    });

    it('should return array filled with zeros', () => {
      const starArray = component.getStarArray(4);
      expect(starArray).toEqual([0, 0, 0, 0]);
    });

    it('should handle edge cases', () => {
      expect(component.getStarArray(0)).toHaveLength(0);
      expect(component.getStarArray(5)).toHaveLength(5);
    });
  });

  it('should contain testimonials with location-specific context', () => {
    const allText = component.testimonials
      .map((t) => `${t.text} ${t.role}`)
      .join(' ')
      .toLowerCase();

    expect(allText).toContain('surco');
    expect(allText).toContain('técnico');
    expect(allText).toContain('repartidor');
  });
});
