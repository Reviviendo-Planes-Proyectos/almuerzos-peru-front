# 🛠️ Tecnologías Utilizadas

El proyecto **Almuerza Perú** integra tecnologías modernas para frontend, calidad, pruebas y automatización. Todo el stack está alineado con Angular 18, SSR, PWA y las mejores prácticas de desarrollo.

<p align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular Logo" width="80" />
</p>

&nbsp;

## 🎯 Frontend

| Herramienta                | Versión | Descripción                                   |
| -------------------------- | ------- | --------------------------------------------- |
| **Angular**                | 18.2.13 | Framework principal SPA/PWA.                  |
| **Angular Material**       | 18.2.13 | Componentes UI Material Design.               |
| **Angular CDK**            | 18.2.13 | Primitivas para componentes personalizados.   |
| **Angular Service Worker** | 18.2.13 | Funcionalidades PWA y offline.                |
| **Angular SSR**            | 18.2.20 | Server-Side Rendering para SEO y performance. |
| **Tailwind CSS**           | 3.4.17  | Framework utilitario de estilos.              |
| **Tailwind CSS Animate**   | 1.0.7   | Animaciones predefinidas para Tailwind.       |
| **Express**                | 4.21.2  | Servidor Node.js para SSR.                    |
| **TypeScript**             | 5.5.4   | Lenguaje tipado para Angular.                 |
| **RxJS**                   | 7.8.1   | Programación reactiva.                        |
| **PostCSS**                | 8.4.38  | Transformación CSS con plugins.               |
| **Autoprefixer**           | 10.4.21 | Prefijos automáticos para CSS.                |

&nbsp;

## 📦 Gestión de Dependencias

| Herramienta        | Versión | Descripción                                             |
| ------------------ | ------- | ------------------------------------------------------- |
| **npm**            | 10.x    | Gestor de paquetes JavaScript.                          |
| **Angular CLI**    | 18.2.13 | CLI para scaffolding, builds y utilidades Angular.      |
| **Angular DevKit** | 18.2.20 | Herramientas de desarrollo y construcción para Angular. |

&nbsp;

## 🧪 Pruebas y Cobertura

Herramientas para asegurar la calidad del código con unit tests y E2E:

| Herramienta               | Versión | Propósito                                            |
| ------------------------- | ------- | ---------------------------------------------------- |
| **Jest**                  | 29.7.0  | Framework moderno para pruebas unitarias en Angular. |
| **Jest Preset Angular**   | 14.2.4  | Configuración optimizada de Jest para Angular.       |
| **Angular Builders Jest** | 18.0.0  | Integración avanzada de Jest con Angular CLI.        |
| **Playwright**            | 1.54.1  | Pruebas end-to-end multiplataforma.                  |
| **ts-jest**               | 29.1.1  | Transformador TypeScript para Jest.                  |

&nbsp;

## 🧹 Calidad de Código y Automatización

Herramientas para mantener el código limpio, consistente y profesional:

| Herramienta     | Versión | Descripción                                                              |
| --------------- | ------- | ------------------------------------------------------------------------ |
| **Biome**       | 2.0.6   | Linter y formateador para TypeScript, HTML y SCSS.                       |
| **Prettier**    | 3.6.2   | Formateador de código para HTML y SCSS.                                  |
| **Husky**       | 9.1.7   | Git Hooks automáticos para validaciones y formateo antes de cada commit. |
| **Lint-staged** | 16.1.2  | Ejecuta Biome y Prettier solo en archivos staged.                        |
| **Commitlint**  | 19.8.1  | Valida mensajes de commit (Conventional Commits).                        |
| **SonarCloud**  | -       | Análisis continuo de calidad y seguridad desde GitHub Actions.           |

> Todas estas herramientas están integradas con **Husky** para funcionar automáticamente antes de cada commit. Así el historial del repositorio es limpio y coherente.

&nbsp;

## 🎯 Configuración Angular 18

### ⚡ Arquitectura Moderna

- **Standalone Components**: Sin módulos tradicionales.
- **ApplicationConfig**: Configuración basada en providers.
- **Tree Shaking**: Bundles optimizados automáticamente.
- **Zone.js**: Configurado correctamente en polyfills.

### 🔄 Server-Side Rendering

- **Angular Universal**: Implementado con `@angular/ssr`
- **Express Server**: Node.js para servir la aplicación
- **Hydration**: Cliente-servidor sincronizado
- **Build optimizado**: 553.14 kB inicial

### � Templates de Pull Request

El proyecto incluye templates para Pull Request y bugfix, ubicados en `.github/PULL_REQUEST_TEMPLATE/`. Estos aseguran que cada contribución cumpla con los estándares de calidad, pruebas y documentación:

- **General Pull Request**: Checklist de calidad, pruebas, formato, idioma y documentación.
- **Bugfix**: Checklist específico para corrección de errores, validación y test.

> Los templates se aplican automáticamente al crear un PR en GitHub y ayudan a mantener la calidad y trazabilidad del proyecto.

### �📱 Progressive Web App

- **Service Worker**: Funcionalidad offline
- **Manifest**: Configurado para instalación
- **Material Theme**: Indigo-Pink precompilado
- **Performance**: Optimizado para dispositivos móviles

---

© 2025 Almuerzos Perú
