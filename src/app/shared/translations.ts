// Sistema de traducción simplificado - Re-export desde i18n
export * from './i18n';
export { TranslateDirective } from './i18n/directives/translate.directive';
export { TranslatePipe } from './i18n/pipes/translate.pipe';
// Re-export directo para compatibilidad
export { I18nService } from './i18n/services/translation.service';
