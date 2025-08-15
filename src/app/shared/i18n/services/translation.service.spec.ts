import { TestBed } from '@angular/core/testing';
import { I18nService } from './translation.service';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

const mockFetch = jest.fn();

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    global.fetch = mockFetch;

    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({})
    } as Response);

    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setLang', () => {
    it('should set language and save to localStorage', () => {
      service.setLang('en');

      expect(service.getLang()).toBe('en');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('app_language', 'en');
    });

    it('should not change language if same language is provided', () => {
      const initialLang = service.getLang();
      service.setLang(initialLang);

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should load new language when switching to unloaded language', async () => {
      (service as any).isLoaded.set(true);
      (service as any).messages.set({ es: { 'test.key': 'Prueba' }, en: {} });

      expect(service.isTranslationsLoaded()).toBe(true);

      const currentLang = service.getLang();
      const newLang = currentLang === 'es' ? 'en' : 'es';
      const mockData = { 'test.key': 'Test' };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockData)
      } as Response);

      await service.setLang(newLang);

      expect(service.getLang()).toBe(newLang);
      expect(service.isTranslationsLoaded()).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(`/messages/${newLang}.json`);
    });

    it('should not fetch when switching to already loaded language', async () => {
      (service as any).isLoaded.set(true);
      (service as any).messages.set({
        es: { 'test.key': 'Prueba' },
        en: { 'test.key': 'Test' }
      });

      const currentLang = service.getLang();
      const newLang = currentLang === 'es' ? 'en' : 'es';

      await service.setLang(newLang);

      expect(service.getLang()).toBe(newLang);
      expect(service.isTranslationsLoaded()).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('language loading from localStorage', () => {
    it('should use default language when localStorage returns invalid value', () => {
      localStorageMock.getItem.mockReturnValue('invalid');
      const newService = new I18nService();
      expect(newService.getLang()).toBe('es');
    });

    it('should use saved language when localStorage returns valid value', () => {
      localStorageMock.getItem.mockReturnValue('en');
      const newService = new I18nService();
      expect(newService.getLang()).toBe('en');
    });

    it('should use default language when localStorage returns null', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const newService = new I18nService();
      expect(newService.getLang()).toBe('es');
    });
  });

  describe('loadMessages', () => {
    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const newService = new I18nService();
      await newService.initializeTranslations();

      expect(newService.isTranslationsLoaded()).toBe(true);
    });

    it('should load messages successfully', async () => {
      const mockEsData = { 'test.key': 'Prueba' };
      const mockEnData = { 'test.key': 'Test' };

      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockEsData) } as Response)
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockEnData) } as Response);

      const newService = new I18nService();
      await newService.initializeTranslations();

      expect(newService.isTranslationsLoaded()).toBe(true);
    });
  });

  describe('t method basic functionality', () => {
    it('should return key when translations not loaded', () => {
      expect(service.t('test.key')).toBe('test.key');
    });

    it('should handle non-string translation values', () => {
      (service as any).messages.set({
        es: {
          'number.key': 123,
          'object.key': { value: 'test' }
        },
        en: {}
      });
      (service as any).isLoaded.set(true);

      expect(service.t('number.key')).toBe('number.key');
      expect(service.t('object.key')).toBe('object.key');
    });
  });
});
