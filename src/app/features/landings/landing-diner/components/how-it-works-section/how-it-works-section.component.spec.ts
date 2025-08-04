import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HowItWorksSectionComponent } from './how-it-works-section.component';

describe('HowItWorksSectionComponent', () => {
  let component: HowItWorksSectionComponent;
  let fixture: ComponentFixture<HowItWorksSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowItWorksSectionComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HowItWorksSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have steps data', () => {
    expect(component.steps).toBeDefined();
    expect(component.steps.length).toBe(3);
  });

  it('should have correct steps structure', () => {
    for (const step of component.steps) {
      expect(step).toHaveProperty('step');
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('image');
    }
  });

  it('should have sequential step numbers', () => {
    expect(component.steps[0].step).toBe('1');
    expect(component.steps[1].step).toBe('2');
    expect(component.steps[2].step).toBe('3');
  });

  it('should contain expected step titles', () => {
    const titles = component.steps.map((s) => s.title);

    expect(titles).toContain('Busca tu zona');
    expect(titles).toContain('Explora menús');
    expect(titles).toContain('¡Disfruta!');
  });

  it('should have non-empty descriptions for all steps', () => {
    for (const step of component.steps) {
      expect(step.description).toBeTruthy();
      expect(step.description.length).toBeGreaterThan(0);
    }
  });

  it('should have valid image paths for all steps', () => {
    for (const step of component.steps) {
      expect(step.image).toBeTruthy();
      expect(step.image).toContain('/img/landing/');
      expect(step.image).toContain('.png');
    }
  });

  it('should have logical step progression', () => {
    expect(component.steps[0].description).toContain('ubicación');
    expect(component.steps[1].description).toContain('menús');
    expect(component.steps[2].description).toContain('restaurante');
  });
});
