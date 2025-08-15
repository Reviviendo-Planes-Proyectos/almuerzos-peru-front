import { TestBed } from '@angular/core/testing';
import { I18nService } from '../services/translation.service';
import { initializeTranslations } from './translation-initializer';

describe('initializeTranslations', () => {
  let mockI18nService: jest.Mocked<I18nService>;

  beforeEach(() => {
    mockI18nService = {
      initializeTranslations: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<I18nService>;

    TestBed.configureTestingModule({
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    });
  });

  it('should return a function that calls i18nService.initializeTranslations', async () => {
    const initFunction = initializeTranslations(mockI18nService);

    expect(typeof initFunction).toBe('function');

    await initFunction();

    expect(mockI18nService.initializeTranslations).toHaveBeenCalledTimes(1);
  });

  it('should handle initialization errors gracefully', async () => {
    mockI18nService.initializeTranslations.mockRejectedValueOnce(new Error('Init failed'));

    const initFunction = initializeTranslations(mockI18nService);

    await expect(initFunction()).rejects.toThrow('Init failed');
    expect(mockI18nService.initializeTranslations).toHaveBeenCalledTimes(1);
  });

  it('should return the same promise when called multiple times', async () => {
    const initFunction = initializeTranslations(mockI18nService);

    const promise1 = initFunction();
    const promise2 = initFunction();

    await Promise.all([promise1, promise2]);

    expect(mockI18nService.initializeTranslations).toHaveBeenCalledTimes(2);
  });

  it('should work with successful initialization', async () => {
    mockI18nService.initializeTranslations.mockResolvedValueOnce(undefined);

    const initFunction = initializeTranslations(mockI18nService);

    const result = await initFunction();

    expect(result).toBeUndefined();
    expect(mockI18nService.initializeTranslations).toHaveBeenCalledTimes(1);
  });

  it('should handle different service instances', async () => {
    const anotherMockService = {
      initializeTranslations: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<I18nService>;

    const initFunction1 = initializeTranslations(mockI18nService);
    const initFunction2 = initializeTranslations(anotherMockService);

    await initFunction1();
    await initFunction2();

    expect(mockI18nService.initializeTranslations).toHaveBeenCalledTimes(1);
    expect(anotherMockService.initializeTranslations).toHaveBeenCalledTimes(1);
  });
});
