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
});
