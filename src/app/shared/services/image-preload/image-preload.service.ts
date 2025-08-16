import { Injectable } from '@angular/core';
import { ASSET_URLS } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ImagePreloadService {
  private preloadedImages = new Set<string>();

  // Preload critical images on app start
  preloadCriticalImages(): void {
    const criticalImages = [
      ASSET_URLS.AUTH_BACKGROUND,
      ASSET_URLS.LOGO,
      ASSET_URLS.AUTH_PROFILE_COMENSAL,
      ASSET_URLS.AUTH_PROFILE_RESTAURANTE,
      ASSET_URLS.LANDING_HERO_RESTAURANT_PHONE
    ];

    for (const url of criticalImages) {
      this.preloadImage(url);
    }
  }

  // Preload single image
  preloadImage(src: string): Promise<undefined> {
    if (this.preloadedImages.has(src)) {
      return Promise.resolve(undefined);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedImages.add(src);
        resolve(undefined);
      };
      img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
      img.src = src;
    });
  }

  // Preload array of images
  preloadImages(urls: string[]): Promise<undefined[]> {
    return Promise.all(urls.map((url) => this.preloadImage(url)));
  }

  // Check if image is preloaded
  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }
}
