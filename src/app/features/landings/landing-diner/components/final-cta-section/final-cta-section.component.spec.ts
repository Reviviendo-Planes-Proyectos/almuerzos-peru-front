import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FinalCtaSectionComponent } from './final-cta-section.component';

describe('FinalCtaSectionComponent', () => {
  let component: FinalCtaSectionComponent;
  let fixture: ComponentFixture<FinalCtaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalCtaSectionComponent, FormsModule, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalCtaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty email', () => {
    expect(component.email).toBe('');
  });

  it('should allow email property to be set', () => {
    const testEmail = 'test@example.com';
    component.email = testEmail;
    expect(component.email).toBe(testEmail);
  });

  it('should have stats data', () => {
    expect(component.stats).toBeDefined();
    expect(component.stats.length).toBe(3);
  });

  it('should have correct stats structure', () => {
    for (const stat of component.stats) {
      expect(stat).toHaveProperty('value');
      expect(stat).toHaveProperty('label');
    }
  });

  it('should have expected stats values', () => {
    const values = component.stats.map((s) => s.value);

    expect(values).toContain('500+');
    expect(values).toContain('10k+');
    expect(values).toContain('4.8★');
  });

  it('should have descriptive stats labels', () => {
    const labels = component.stats.map((s) => s.label);

    expect(labels).toContain('Restaurantes verificados');
    expect(labels).toContain('Usuarios activos');
    expect(labels).toContain('Calificación promedio');
  });

  it('should have non-empty stats labels', () => {
    for (const stat of component.stats) {
      expect(stat.label).toBeTruthy();
      expect(stat.label.length).toBeGreaterThan(0);
    }
  });

  it('should have non-empty stats values', () => {
    for (const stat of component.stats) {
      expect(stat.value).toBeTruthy();
      expect(stat.value.length).toBeGreaterThan(0);
    }
  });

  describe('onSubscribe method', () => {
    it('should be defined', () => {
      expect(component.onSubscribe).toBeDefined();
      expect(typeof component.onSubscribe).toBe('function');
    });

    it('should execute without errors', () => {
      expect(() => component.onSubscribe()).not.toThrow();
    });

    it('should be callable with valid email', () => {
      component.email = 'user@example.com';
      expect(() => component.onSubscribe()).not.toThrow();
    });

    it('should be callable with empty email', () => {
      component.email = '';
      expect(() => component.onSubscribe()).not.toThrow();
    });
  });

  it('should have marketing-focused stats', () => {
    const allLabels = component.stats
      .map((s) => s.label)
      .join(' ')
      .toLowerCase();

    expect(allLabels).toContain('restaurantes');
    expect(allLabels).toContain('usuarios');
    expect(allLabels).toContain('calificación');
  });

  it('should have compelling numeric stats', () => {
    const numericStats = component.stats.filter((s) => /\d+/.test(s.value));
    expect(numericStats.length).toBeGreaterThan(0);
  });
});
