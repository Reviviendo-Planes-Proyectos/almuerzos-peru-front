import { TestBed } from '@angular/core/testing';
import { ImagePreloadService } from './image-preload.service';

describe('ImagePreloadService', () => {
  let service: ImagePreloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagePreloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('preloadImage', () => {
    it('should preload single image successfully', async () => {
      const imageUrl = 'https://example.com/test-image.jpg';

      // Mock Image constructor
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: ''
      };

      const imageConstructorSpy = jest.spyOn(window, 'Image').mockImplementation(() => mockImage as any);

      const preloadPromise = service.preloadImage(imageUrl);

      // Simulate successful load
      if (mockImage.onload) mockImage.onload();

      await expect(preloadPromise).resolves.toBeUndefined();
      expect(mockImage.src).toBe(imageUrl);
      expect(service.isPreloaded(imageUrl)).toBe(true);

      imageConstructorSpy.mockRestore();
    });

    it('should handle image load error', async () => {
      const imageUrl = 'https://example.com/invalid-image.jpg';

      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: ''
      };

      const imageConstructorSpy = jest.spyOn(window, 'Image').mockImplementation(() => mockImage as any);

      const preloadPromise = service.preloadImage(imageUrl);

      // Simulate error
      if (mockImage.onerror) mockImage.onerror();

      await expect(preloadPromise).rejects.toThrow(`Failed to preload image: ${imageUrl}`);
      expect(service.isPreloaded(imageUrl)).toBe(false);

      imageConstructorSpy.mockRestore();
    });

    it('should not preload same image twice', async () => {
      const imageUrl = 'https://example.com/test-image.jpg';

      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: ''
      };

      const imageConstructorSpy = jest.spyOn(window, 'Image').mockImplementation(() => mockImage as any);

      // First preload
      const firstPreload = service.preloadImage(imageUrl);
      if (mockImage.onload) mockImage.onload();
      await firstPreload;

      // Second preload should resolve immediately
      const secondPreload = service.preloadImage(imageUrl);
      await expect(secondPreload).resolves.toBeUndefined();

      // Image constructor should only be called once
      expect(imageConstructorSpy).toHaveBeenCalledTimes(1);

      imageConstructorSpy.mockRestore();
    });
  });

  describe('preloadImages', () => {
    it('should preload multiple images', async () => {
      const imageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];

      const mockImages: any[] = [];
      const imageConstructorSpy = jest.spyOn(window, 'Image').mockImplementation(() => {
        const mockImage = {
          onload: null as (() => void) | null,
          onerror: null as (() => void) | null,
          src: ''
        };
        mockImages.push(mockImage);
        return mockImage as any;
      });

      const preloadPromise = service.preloadImages(imageUrls);

      // Simulate successful loads
      for (const img of mockImages) {
        if (img.onload) img.onload();
      }

      await expect(preloadPromise).resolves.toHaveLength(2);
      expect(imageConstructorSpy).toHaveBeenCalledTimes(2);

      imageConstructorSpy.mockRestore();
    });
  });

  describe('isPreloaded', () => {
    it('should return false for non-preloaded image', () => {
      expect(service.isPreloaded('https://example.com/new-image.jpg')).toBe(false);
    });

    it('should return true for preloaded image', async () => {
      const imageUrl = 'https://example.com/test-image.jpg';

      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: ''
      };

      const imageConstructorSpy = jest.spyOn(window, 'Image').mockImplementation(() => mockImage as any);

      const preloadPromise = service.preloadImage(imageUrl);
      if (mockImage.onload) mockImage.onload();
      await preloadPromise;

      expect(service.isPreloaded(imageUrl)).toBe(true);

      imageConstructorSpy.mockRestore();
    });
  });
});
