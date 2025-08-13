import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { I18nService } from '../../../shared/i18n/services/translation.service';
import { MaterialModule } from '../../../shared/modules';
import { LandingDinerComponent } from './landing-diner.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.hero.title.findMenu': 'Encuentra tu menú',
      'landing.hero.title.noWasteTime': 'sin perder tiempo',
      'landing.hero.description.discover': 'Descubre',
      'landing.hero.description.perfect': 'el almuerzo perfecto',
      'landing.hero.cards.eatingNow': 'comiendo ahora',
      'landing.hero.cards.peakTime': 'hora pico',
      'landing.hero.cards.rating': 'calificación',
      'landing.hero.buttons.searchRestaurants': 'Buscar restaurantes',
      'landing.hero.scrollIndicator': 'Desplázate hacia abajo',
      'landing.diner.enhancedSearch.title.where': '¿Dónde',
      'landing.diner.enhancedSearch.title.lunchToday': 'almorzarás hoy?',
      'landing.diner.enhancedSearch.subtitle': 'Encuentra los mejores restaurantes cerca de ti',
      'landing.diner.enhancedSearch.findLunch': 'Encuentra tu almuerzo',
      'landing.diner.enhancedSearch.nearYou': 'cerca de ti',
      'landing.diner.enhancedSearch.form.label': 'Buscar ubicación',
      'landing.diner.enhancedSearch.form.placeholder': 'Ej: San Isidro, Miraflores...',
      'landing.diner.enhancedSearch.form.hint': 'Ingresa tu distrito o zona',
      'landing.diner.enhancedSearch.popularDistricts': 'Distritos populares'
    };
    return translations[key] || key;
  }

  isTranslationsLoaded(): boolean {
    return true;
  }
}

describe('LandingDinerComponent', () => {
  let component: LandingDinerComponent;
  let fixture: ComponentFixture<LandingDinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingDinerComponent, BrowserAnimationsModule, FormsModule, MaterialModule],
      providers: [provideRouter([]), { provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingDinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
