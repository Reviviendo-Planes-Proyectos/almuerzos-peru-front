import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeaturesSectionComponent } from './features-section.component';

describe('FeaturesSectionComponent', () => {
  let component: FeaturesSectionComponent;
  let fixture: ComponentFixture<FeaturesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesSectionComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have features data', () => {
    expect(component.features).toBeDefined();
    expect(component.features.length).toBe(4);
  });

  it('should have correct features structure', () => {
    for (const feature of component.features) {
      expect(feature).toHaveProperty('icon');
      expect(feature).toHaveProperty('title');
      expect(feature).toHaveProperty('description');
      expect(feature).toHaveProperty('image');
    }
  });

  it('should contain expected feature titles', () => {
    const titles = component.features.map((f) => f.title);

    expect(titles).toContain('Búsqueda inteligente');
    expect(titles).toContain('Ahorra tiempo');
    expect(titles).toContain('Ubicación precisa');
    expect(titles).toContain('Favoritos');
  });

  it('should contain expected feature icons', () => {
    const icons = component.features.map((f) => f.icon);

    expect(icons).toContain('search');
    expect(icons).toContain('schedule');
    expect(icons).toContain('location_on');
    expect(icons).toContain('favorite');
  });

  it('should have non-empty descriptions for all features', () => {
    for (const feature of component.features) {
      expect(feature.description).toBeTruthy();
      expect(feature.description.length).toBeGreaterThan(0);
    }
  });

  it('should have valid image paths for all features', () => {
    for (const feature of component.features) {
      expect(feature.image).toBeTruthy();
      expect(feature.image).toContain('/img/landing/');
      expect(feature.image).toContain('.png');
    }
  });
});
