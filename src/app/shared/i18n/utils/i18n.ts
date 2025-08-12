import { inject } from '@angular/core';
import { I18nService } from '../services/translation.service';

/**
 * Función standalone para usar en contextos de inyección
 * @param key - Clave de traducción
 * @returns Texto traducido
 */
export function useTranslation(key: string): string {
  const i18n = inject(I18nService);
  return i18n.t(key);
}

/**
 * Hook para obtener el servicio completo
 * @returns Servicio de traducción
 */
export function useI18n(): I18nService {
  return inject(I18nService);
}
