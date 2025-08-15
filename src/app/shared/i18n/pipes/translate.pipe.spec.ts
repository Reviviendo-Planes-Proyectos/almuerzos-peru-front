import { TestBed } from '@angular/core/testing';
import { I18nService } from '../services/translation.service';
import { TranslatePipe } from './translate.pipe';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let mockI18nService: jest.Mocked<I18nService>;

  beforeEach(() => {
    mockI18nService = {
      t: jest.fn(),
      isReady: jest.fn().mockReturnValue(true),
      currentLang: jest.fn().mockReturnValue('es')
    } as unknown as jest.Mocked<I18nService>;

    TestBed.configureTestingModule({
      providers: [TranslatePipe, { provide: I18nService, useValue: mockI18nService }]
    });

    pipe = TestBed.inject(TranslatePipe);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should call i18n service with correct key', () => {
    const key = 'test.key';
    const expectedTranslation = 'Test Translation';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = pipe.transform(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });

  it('should handle empty key', () => {
    const key = '';
    const expectedTranslation = '';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = pipe.transform(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });

  it('should handle non-existent key', () => {
    const key = 'non.existent.key';
    const expectedTranslation = 'non.existent.key';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = pipe.transform(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });

  it('should handle nested translation keys', () => {
    const key = 'auth.login.title';
    const expectedTranslation = 'Iniciar Sesión';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = pipe.transform(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });

  it('should handle when translations are not ready', () => {
    const key = 'test.key';

    mockI18nService.isReady.mockReturnValue(false);
    mockI18nService.t.mockReturnValue(key);

    const result = pipe.transform(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(key);
  });

  it('should trigger computed signal for reactivity', () => {
    const key = 'test.key';
    const expectedTranslation = 'Test';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    pipe.transform(key);

    expect(mockI18nService.isReady).toHaveBeenCalled();
    expect(mockI18nService.currentLang).toHaveBeenCalled();
  });

  it('should handle language changes reactively', () => {
    const key = 'test.key';

    // First call with Spanish
    mockI18nService.currentLang.mockReturnValue('es');
    mockI18nService.t.mockReturnValue('Prueba');

    let result = pipe.transform(key);
    expect(result).toBe('Prueba');

    // Change to English
    mockI18nService.currentLang.mockReturnValue('en');
    mockI18nService.t.mockReturnValue('Test');

    result = pipe.transform(key);
    expect(result).toBe('Test');
  });

  it('should handle null return from computed signal', () => {
    const key = 'test.key';

    mockI18nService.isReady.mockReturnValue(false);
    mockI18nService.t.mockReturnValue(key);

    const result = pipe.transform(key);

    expect(result).toBe(key);
  });

  it('should work with special characters in keys', () => {
    const key = 'special.chars.ñáéíóú';
    const expectedTranslation = 'Caracteres Especiales';

    mockI18nService.t.mockReturnValue(expectedTranslation);

    const result = pipe.transform(key);

    expect(mockI18nService.t).toHaveBeenCalledWith(key);
    expect(result).toBe(expectedTranslation);
  });
});
