import { signal } from '@angular/core';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { I18nService } from '../shared/i18n/services/translation.service';

// Mock del I18nService para tests
export class MockI18nService {
  // Signals básicos para compatibilidad
  private _isReady = signal(true);
  private _currentLang = signal('es');

  // Getters para compatibilidad con signals - nombres correctos
  isReady = this._isReady.asReadonly();
  currentLang = this._currentLang.asReadonly();

  // Alias para compatibilidad
  get isTranslationsReady() {
    return this.isReady;
  }
  get currentLanguage() {
    return this.currentLang;
  }

  // Traducciones de ejemplo para tests
  private translations: Record<string, string> = {
    // App general
    'app.name': 'ALMUERZOS PERU',
    'app.tagline': '¡Encuentra tu menú diario, sin perder tiempo!',

    // Auth
    'auth.login.title': 'Iniciar Sesión',
    'auth.login.button': 'Iniciar Sesión',
    'auth.login.withGoogle': 'Iniciar Sesión con Google',
    'auth.login.withFacebook': 'Iniciar Sesión con Facebook',
    'auth.login.withEmail': 'Iniciar Sesión con Correo',
    'auth.login.forgot': '¿Olvidaste tu contraseña?',
    'auth.login.forgotPassword': 'Olvidé mi Contraseña',
    'auth.login.noAccount': '¿No tienes cuenta? Regístrate',
    'auth.register.title': '¿Cómo deseas registrarte?',
    'auth.register.button': 'Registrarse',
    'auth.register.withGoogle': 'Continuar con Google',
    'auth.register.withFacebook': 'Continuar con Facebook',
    'auth.register.withEmail': 'Continuar con Correo',
    'auth.register.later': 'Registrarme después',
    'auth.register.connecting': 'Conectando...',
    'auth.profileSelection.question': '¿Cómo deseas ingresar?',
    'auth.profileSelection.registerLater': 'Registrarme luego',
    'auth.forgot.title': 'Olvidé mi Contraseña',
    'auth.forgot.emailSent.title': 'Email Enviado',
    'auth.forgot.emailSent.description': 'Te hemos enviado un enlace de recuperación',
    'auth.forgot.emailSent.checkSpam': 'Revisa tu carpeta de spam',
    'auth.forgot.resendButton': 'Reenviar Email',
    'auth.forgot.backToLogin': 'Volver al Login',
    'auth.forgot.sending': 'Enviando...',
    'auth.customer.profilePhoto.title': 'Foto de Perfil',
    'auth.customer.profilePhoto.subtitle': 'Elige una foto que te represente',
    'auth.customer.profilePhoto.selectFileButton': 'Seleccionar archivo',
    'auth.customer.profilePhoto.removeImageButton': 'Quitar imagen',
    'auth.customer.profilePhoto.verifyEmailButton': 'Verificar email',

    // Common
    'common.continue': 'Continuar',
    'common.cancel': 'Cancelar',
    'common.back': 'Volver',
    'common.or': 'O',
    'common.loading': 'Conectando...',
    'common.background': 'Fondo',
    'common.google': 'Google',
    'common.facebook': 'Facebook',
    'common.language.select': 'Seleccionar idioma',
    'common.spanish': 'Español',
    'common.english': 'English',
    'messages.welcome': '¡Bienvenido a Almuerzos Peru!',

    // Components
    'components.languageSelector.selectLanguage': 'Seleccionar idioma',

    // Landing
    'landing.hero.title': 'Sube tu carta.',
    'landing.hero.title.prefix': 'Sube tu',
    'landing.hero.title.highlight': 'carta.',
    'landing.benefits.title': 'Transforman',
    'landing.benefits.title.highlight': 'Transforman',

    // Landing Restaurant específico
    'landing.restaurant.benefits.title.prefix': 'Beneficios que',
    'landing.restaurant.benefits.title.highlight': 'Transforman',
    'landing.restaurant.benefits.title.suffix': 'tu Negocio',

    // How It Works Section
    'landing.restaurant.howItWorks.title': '¿Cómo',
    'landing.restaurant.howItWorks.titleHighlight': 'Funciona',
    'landing.restaurant.howItWorks.titleSuffix': '?',

    // Testimonials Section
    'landing.restaurant.testimonials.title': 'Lo que Dicen Nuestros',
    'landing.restaurant.testimonials.titleHighlight': 'Clientes',

    // Final CTA Section
    'landing.restaurant.finalCta.title': '¿Todavía usas menús impresos? Tus clientes ya no.',
    'landing.restaurant.finalCta.titleHighlight': 'Únete al cambio.',
    'landing.restaurant.finalCta.subtitle':
      '¡Regístrate ahora y comienza a disfrutar de los beneficios de tener un menú digital!',
    'landing.restaurant.finalCta.primaryBtn': 'Comienza Gratis Ahora',
    'landing.restaurant.hero.title.upload': 'Sube tu carta.',
    'landing.restaurant.hero.title.sales': 'Incrementa tus ventas. Fácil y rápido.',
    'landing.restaurant.pricing.title.prefix': 'Planes que se adaptan a',
    'landing.restaurant.pricing.title.highlight': 'tu ritmo',
    'landing.restaurant.pricing.title.suffix': 'de crecimiento',
    'landing.restaurant.pricing.plans.free.title': 'Gratis',
    'landing.restaurant.pricing.plans.premium.title': 'Premium',
    'landing.restaurant.pricing.plans.enterprise.title': 'Ventas'
  };

  t = jest.fn((key: string, params?: Record<string, string>): string => {
    let translation = this.translations[key] || key;

    if (params) {
      for (const param of Object.keys(params)) {
        translation = translation.replace(`{{${param}}}`, params[param]);
      }
    }

    return translation;
  });

  tWithPlaceholder = jest.fn((key: string, placeholders: Record<string, string>): string => {
    return this.t(key, placeholders);
  });

  setLang(lang: string): void {
    this._currentLang.set(lang);
  }

  getLang(): string {
    return this._currentLang();
  }

  loadTranslations(_lang: string) {
    return of(this.translations);
  }

  initializeTranslations() {
    return Promise.resolve();
  }

  initializeTranslationsOptimized() {
    return Promise.resolve();
  }
}

// Mock de SwUpdate para tests
export const mockSwUpdate = {
  isEnabled: false,
  available: EMPTY,
  activated: EMPTY,
  versionUpdates: EMPTY,
  unrecoverable: EMPTY,
  checkForUpdate: () => Promise.resolve(),
  activateUpdate: () => Promise.resolve()
};

// Mock de SwPush para tests
export const mockSwPush = {
  isEnabled: false,
  messages: EMPTY,
  notificationClicks: EMPTY,
  subscription: EMPTY,
  requestSubscription: () => Promise.resolve(),
  unsubscribe: () => Promise.resolve()
};

// Mock de MatSnackBar para tests
export const mockMatSnackBar = {
  open: jest.fn(),
  dismiss: jest.fn(),
  ngOnDestroy: jest.fn()
};

// Mock de PwaService para tests
export const mockPwaService = {
  // Signals para el nuevo sistema
  canInstall: signal(false),
  isInstalled: signal(false),
  showAppReminder: signal(false),

  // Observables para compatibilidad con pruebas existentes
  updateAvailable$: new BehaviorSubject(false),
  showAppReminder$: new BehaviorSubject(false),
  isAppInstalled$: new BehaviorSubject(false),

  // Métodos del servicio
  isInstallable: () => false,
  installApp: jest.fn(() => Promise.resolve()),
  forceShowInstallPrompt: jest.fn(),
  dismissAppReminder: jest.fn(),
  showReminderNotification: jest.fn(),
  updateApp: jest.fn(() => Promise.resolve()),
  forceShowUpdateBanner: jest.fn(),
  forceShowReminder: jest.fn(),
  shouldShowReminder: jest.fn().mockReturnValue(true),

  // Métodos adicionales para compatibilidad
  canInstallApp: jest.fn().mockReturnValue(false),
  isInstalledApp: jest.fn().mockReturnValue(false),
  getInstallStatus: jest.fn().mockReturnValue({
    canInstall: false,
    hasPrompt: false,
    reason: 'Test reason'
  }),
  getDebugInfo: jest.fn().mockReturnValue({
    isBrowser: true,
    isInstalled: false,
    canInstall: false
  }),
  simulateInstallation: jest.fn(),
  simulateUninstallation: jest.fn(),
  clearPwaData: jest.fn()
};

// Agregar método isInstalled como función después del signal
(mockPwaService as any).isInstalled = jest.fn().mockReturnValue(false);

// Instancia del mock de I18nService
export const mockI18nService = new MockI18nService();

// Providers comunes para tests con PWA
export const PWA_TEST_PROVIDERS = [
  { provide: 'SwUpdate', useValue: mockSwUpdate },
  { provide: 'SwPush', useValue: mockSwPush },
  { provide: 'MatSnackBar', useValue: mockMatSnackBar },
  { provide: 'PLATFORM_ID', useValue: 'browser' }
];

// Providers comunes para tests con I18n
export const I18N_TEST_PROVIDERS = [{ provide: I18nService, useValue: mockI18nService }];

// Providers completos para tests
export const COMPLETE_TEST_PROVIDERS = [...PWA_TEST_PROVIDERS, ...I18N_TEST_PROVIDERS];
