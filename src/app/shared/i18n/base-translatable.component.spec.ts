import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BaseTranslatableComponent } from './base-translatable.component';
import { I18nService } from './services/translation.service';

@Component({
  template: '',
  standalone: true
})
class TestComponent extends BaseTranslatableComponent {
  public testTranslate(key: string): string {
    return this.t(key);
  }

  public get testCurrentLang() {
    return this.currentLang;
  }

  public get testIsReady() {
    return this.isTranslationsReady;
  }

  public get testLangChanged() {
    return this.langChanged;
  }
}

describe('BaseTranslatableComponent', () => {
  let component: TestComponent;
  let mockI18nService: jest.Mocked<I18nService>;

  beforeEach(async () => {
    mockI18nService = {
      t: jest.fn(),
      currentLang: jest.fn().mockReturnValue('es'),
      isReady: jest.fn().mockReturnValue(true)
    } as unknown as jest.Mocked<I18nService>;

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create component extending BaseTranslatableComponent', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(BaseTranslatableComponent);
  });

  it('should provide t() method for translations', () => {
    const key = 'test.key';
    const expectedTranslation = 'Test Translation';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = component.testTranslate(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });

  it('should provide currentLang signal', () => {
    const currentLang = component.testCurrentLang;

    expect(currentLang).toBeDefined();
    expect(typeof currentLang).toBe('function');
  });

  it('should provide isTranslationsReady signal', () => {
    const isReady = component.testIsReady;

    expect(isReady).toBeDefined();
    expect(typeof isReady).toBe('function');
  });

  it('should provide langChanged computed signal', () => {
    const langChanged = component.testLangChanged;

    expect(langChanged).toBeDefined();
    expect(typeof langChanged).toBe('function');
  });

  it('should handle empty translation key', () => {
    const key = '';
    const expectedTranslation = '';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = component.testTranslate(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });

  it('should handle nested translation keys', () => {
    const key = 'auth.login.title';
    const expectedTranslation = 'Iniciar Sesión';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = component.testTranslate(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });
});
