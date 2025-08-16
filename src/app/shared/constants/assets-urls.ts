// Centralized S3 assets configuration
export const ASSETS_CONFIG = {
  S3_BASE_URL: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com',

  AUTH: {
    BACKGROUND: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/auth/background_almuerza_peru.png',
    PROFILE_COMENSAL: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/auth/perfil_comensal.png',
    PROFILE_RESTAURANTE: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/auth/perfil_restaurante.png'
  },

  LANDING: {
    BACKGROUND: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/landing/background_almuerza_peru.png',
    HERO_RESTAURANT_PHONE: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/landing/hero-restaurant-phone.png',
    COZY_RESTAURANT_HERO: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/landing/cozy-restaurant-hero.png'
  },

  COMMON: {
    LOGO: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/logo-almuerzos-peru.png',
    PREVIEW: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/preview.png',
    FAVICON: 'https://almuerzos-peru-public.s3.us-east-1.amazonaws.com/favicon.ico'
  }
} as const;

// Quick access URLs
export const ASSET_URLS = {
  AUTH_BACKGROUND: ASSETS_CONFIG.AUTH.BACKGROUND,
  AUTH_PROFILE_COMENSAL: ASSETS_CONFIG.AUTH.PROFILE_COMENSAL,
  AUTH_PROFILE_RESTAURANTE: ASSETS_CONFIG.AUTH.PROFILE_RESTAURANTE,
  LANDING_BACKGROUND: ASSETS_CONFIG.LANDING.BACKGROUND,
  LANDING_HERO_RESTAURANT_PHONE: ASSETS_CONFIG.LANDING.HERO_RESTAURANT_PHONE,
  LANDING_COZY_RESTAURANT_HERO: ASSETS_CONFIG.LANDING.COZY_RESTAURANT_HERO,
  LOGO: ASSETS_CONFIG.COMMON.LOGO,
  PREVIEW: ASSETS_CONFIG.COMMON.PREVIEW,
  FAVICON: ASSETS_CONFIG.COMMON.FAVICON
} as const;
