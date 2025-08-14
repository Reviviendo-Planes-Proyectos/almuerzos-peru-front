import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService } from '../../../../../../shared/i18n';
import { CoreModule } from '../../../../../../shared/modules';
import { FinalCtaSectionComponent } from './final-cta-section.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.diner.finalCta.stats.restaurants': 'Restaurantes verificados',
      'landing.diner.finalCta.stats.users': 'Usuarios activos',
      'landing.diner.finalCta.stats.rating': 'Calificación promedio'
    };
    return translations[key] || key;
  }
}

describe('FinalCtaSectionComponent', () => {
  let component: FinalCtaSectionComponent;
  let fixture: ComponentFixture<FinalCtaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalCtaSectionComponent, CoreModule, BrowserAnimationsModule],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalCtaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubscribe method', () => {
    it('should be defined', () => {
      expect(component.onStartFree).toBeDefined();
      expect(typeof component.onStartFree).toBe('function');
    });

    it('should execute without errors', () => {
      expect(() => component.onStartFree()).not.toThrow();
    });
  });
});
