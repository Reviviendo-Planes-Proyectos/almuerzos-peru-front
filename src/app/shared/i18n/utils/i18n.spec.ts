import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService } from '../services/translation.service';
import { useI18n, useTranslation } from './i18n';

describe('i18n utils', () => {
  let mockI18nService: jest.Mocked<I18nService>;
  let injector: Injector;

  beforeEach(() => {
    mockI18nService = {
      t: jest.fn(),
      setLang: jest.fn(),
      currentLang: jest.fn(),
      isReady: jest.fn()
    } as unknown as jest.Mocked<I18nService>;

    TestBed.configureTestingModule({
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    });

    injector = TestBed.inject(Injector);
  });

  describe('useTranslation', () => {
    it('should return translated text', () => {
      const expectedTranslation = 'Hello World';
      mockI18nService.t.mockReturnValue(expectedTranslation);

      const result = runInInjectionContext(injector, () => {
        return useTranslation('test.key');
      });

      expect(mockI18nService.t).toHaveBeenCalledWith('test.key');
      expect(result).toBe(expectedTranslation);
    });

    it('should handle empty key', () => {
      const expectedTranslation = '';
      mockI18nService.t.mockReturnValue(expectedTranslation);

      const result = runInInjectionContext(injector, () => {
        return useTranslation('');
      });

      expect(mockI18nService.t).toHaveBeenCalledWith('');
      expect(result).toBe(expectedTranslation);
    });

    it('should handle complex nested keys', () => {
      const expectedTranslation = 'Iniciar Sesión';
      mockI18nService.t.mockReturnValue(expectedTranslation);

      const result = runInInjectionContext(injector, () => {
        return useTranslation('auth.login.title');
      });

      expect(mockI18nService.t).toHaveBeenCalledWith('auth.login.title');
      expect(result).toBe(expectedTranslation);
    });
  });

  describe('useI18n', () => {
    it('should return I18nService instance', () => {
      const result = runInInjectionContext(injector, () => {
        return useI18n();
      });

      expect(result).toBe(mockI18nService);
    });

    it('should allow access to all service methods', () => {
      const service = runInInjectionContext(injector, () => {
        return useI18n();
      });

      expect(service.t).toBeDefined();
      expect(service.setLang).toBeDefined();
      expect(service.currentLang).toBeDefined();
      expect(service.isReady).toBeDefined();
    });
  });
});
