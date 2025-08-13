import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANG = 'es' as const;

  private lang = signal<'es' | 'en'>(this.DEFAULT_LANG);
  private messages = signal<Record<string, any>>({});
  private isLoaded = signal(false);

  public readonly currentLang = this.lang.asReadonly();
  public readonly isReady = this.isLoaded.asReadonly();

  constructor() {
    this.initLanguage();
    this.loadMessages();
  }

  /**
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
  setLang(newLang: 'es' | 'en'): void {
    if (newLang === this.lang()) return;

    this.lang.set(newLang);
    this.saveLanguage(newLang);

    // Trigger reactivity si ya está cargado
    if (this.isLoaded()) {
      this.isLoaded.set(false);
      requestAnimationFrame(() => this.isLoaded.set(true));
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
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as 'es' | 'en' | null;
      if (saved === 'es' || saved === 'en') {
        this.lang.set(saved);
      }
    } catch {
      // Ignorar errores de localStorage (SSR)
    }
  }

  private saveLanguage(lang: 'es' | 'en'): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch {
      // Ignorar errores de localStorage (SSR)
    }
  }

  private async loadMessages(): Promise<void> {
    try {
      const [es, en] = await Promise.all([
        fetch('/messages/es.json').then((r) => r.json()),
        fetch('/messages/en.json').then((r) => r.json())
      ]);

      this.messages.set({ es, en });
      this.isLoaded.set(true);
    } catch (error) {
      console.warn('Error loading translations:', error);
      this.isLoaded.set(true);
    }
  }
}
