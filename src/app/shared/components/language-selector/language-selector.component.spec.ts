import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nService, TranslatePipe } from '../../../shared/translations';
import { LangComponent } from './language-selector.component';

class MockI18nService {
  private lang = signal<'es' | 'en'>('es');
  private translations = signal<Record<string, any>>({
    'common.language.select': 'Seleccionar idioma'
  });
  private loaded = signal(true);

  getLang() {
    return this.lang();
  }

  setLang(lang: 'es' | 'en') {
    this.lang.set(lang);
  }

  t(key: string): string {
    return this.translations()[key] || key;
  }

  isTranslationsLoaded() {
    return this.loaded();
  }
}

describe('LangComponent', () => {
  let component: LangComponent;
  let fixture: ComponentFixture<LangComponent>;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [LangComponent, TranslatePipe],
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current language', () => {
    const selectElement = fixture.nativeElement.querySelector('select');
    expect(selectElement.value).toBe('es');
  });

  it('should have Spanish and English options', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(2);
    expect(options[0].value).toBe('es');
    expect(options[0].textContent.trim()).toBe('🇪🇸 ES');
    expect(options[1].value).toBe('en');
    expect(options[1].textContent.trim()).toBe('🇺🇸 EN');
  });

  it('should change language when option is selected', () => {
    const selectElement = fixture.nativeElement.querySelector('select');
    const setLangSpy = jest.spyOn(mockI18nService, 'setLang');

    selectElement.value = 'en';
    selectElement.dispatchEvent(new Event('change'));

    expect(setLangSpy).toHaveBeenCalledWith('en');
  });

  it('should update select value when language changes', () => {
    mockI18nService.setLang('en');
    fixture.detectChanges();

    const selectElement = fixture.nativeElement.querySelector('select');
    expect(selectElement.value).toBe('en');
  });

  it('should have proper accessibility attributes', () => {
    const selectElement = fixture.nativeElement.querySelector('select');
    expect(selectElement.getAttribute('aria-label')).toBeTruthy();
  });

  it('should be hidden on mobile devices', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480
    });

    const selectElement = fixture.nativeElement.querySelector('select');

    expect(selectElement.classList.contains('hidden')).toBeTruthy();
    expect(selectElement.classList.contains('sm:block')).toBeTruthy();
  });

  it('should be visible on desktop devices', () => {
    const selectElement = fixture.nativeElement.querySelector('select');
    expect(selectElement.classList.contains('sm:block')).toBeTruthy();
  });

  it('should have simplified mobile-first design', () => {
    const selectElement = fixture.nativeElement.querySelector('select');
    expect(selectElement.style.backgroundImage).toBeFalsy();
    expect(selectElement.classList.contains('appearance-none')).toBeTruthy();
  });

  describe('change method', () => {
    it('should call setLang with correct language', () => {
      const setLangSpy = jest.spyOn(mockI18nService, 'setLang');
      const mockEvent = {
        target: { value: 'en' }
      } as any;

      component.change(mockEvent);
      expect(setLangSpy).toHaveBeenCalledWith('en');
    });

    it('should handle both es and en languages', () => {
      const setLangSpy = jest.spyOn(mockI18nService, 'setLang');

      const mockEventEs = {
        target: { value: 'es' }
      } as any;
      component.change(mockEventEs);
      expect(setLangSpy).toHaveBeenCalledWith('es');

      const mockEventEn = {
        target: { value: 'en' }
      } as any;
      component.change(mockEventEn);
      expect(setLangSpy).toHaveBeenCalledWith('en');
    });
  });

  describe('Integration Tests', () => {
    it('should work end-to-end', () => {
      expect(component.i18n.getLang()).toBe('es');

      const selectElement = fixture.nativeElement.querySelector('select');
      selectElement.value = 'en';
      selectElement.dispatchEvent(new Event('change'));

      expect(component.i18n.getLang()).toBe('en');
    });
  });
});
