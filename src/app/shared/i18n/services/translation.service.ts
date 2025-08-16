import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANG = 'es' as const;

  private lang = signal<'es' | 'en'>(this.DEFAULT_LANG);
  private messages = signal<Record<string, any>>({});
  private isLoaded = signal(false);
  private loadPromise: Promise<void> | null = null;

  public readonly currentLang = this.lang.asReadonly();
  public readonly isReady = this.isLoaded.asReadonly();

  constructor() {
    this.initLanguage();
  }

  async initializeTranslations(): Promise<void> {
    if (this.isLoaded()) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.loadMessagesOptimized();
    return this.loadPromise;
  }

  private async loadMessagesOptimized(): Promise<void> {
    try {
      const currentLang = this.lang();

      // Usar HttpClient en lugar de fetch para compatibilidad SSR
      const currentMessages = await firstValueFrom(this.http.get<any>(`/messages/${currentLang}.json`));

      const otherLang = currentLang === 'es' ? 'en' : 'es';
      const otherMessagesPromise = firstValueFrom(this.http.get<any>(`/messages/${otherLang}.json`)).catch(() => ({}));

      this.messages.set({
        [currentLang]: currentMessages,
        [otherLang]: {}
      });

      this.isLoaded.set(true);

      const otherMessages = await otherMessagesPromise;
      this.messages.update((current) => ({
        ...current,
        [otherLang]: otherMessages
      }));
    } catch (error) {
      // En caso de error, crear mensajes vacíos para evitar fallos
      this.messages.set({ es: {}, en: {} });
      this.isLoaded.set(true);

      if (isPlatformBrowser(this.platformId) && window.location?.hostname === 'localhost') {
        console.warn('Error loading translations:', error);
      }
    }
  } /**
   * Traduce una clave de traducción
   */
  t(key: string): string {
    if (!this.isLoaded()) return key;

    const currentMessages = this.messages()[this.lang()];
    if (!currentMessages) return key;

    const keys = key.split('.');
    let value: any = currentMessages;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Cambia el idioma
   */
  async setLang(newLang: 'es' | 'en'): Promise<void> {
    if (newLang === this.lang()) return;

    this.lang.set(newLang);
    this.saveLanguage(newLang);

    // Si el idioma no está cargado, cargarlo
    const messages = this.messages();
    if (!messages[newLang] || Object.keys(messages[newLang]).length === 0) {
      try {
        const newMessages = await firstValueFrom(this.http.get<any>(`/messages/${newLang}.json`));

        this.messages.update((current) => ({
          ...current,
          [newLang]: newMessages
        }));
      } catch (error) {
        if (isPlatformBrowser(this.platformId) && window.location?.hostname === 'localhost') {
          console.warn(`Error loading ${newLang} translations:`, error);
        }
      }
    }
  }

  /**
   * Obtiene el idioma actual
   */
  getLang(): 'es' | 'en' {
    return this.lang();
  }

  /**
   * Verifica si las traducciones están listas
   */
  isTranslationsLoaded(): boolean {
    return this.isLoaded();
  }

  private initLanguage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No hacer nada en SSR
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as 'es' | 'en' | null;
      if (saved === 'es' || saved === 'en') {
        this.lang.set(saved);
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }

  private saveLanguage(lang: 'es' | 'en'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No hacer nada en SSR
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch {
      // Ignorar errores de localStorage
    }
  }
}
