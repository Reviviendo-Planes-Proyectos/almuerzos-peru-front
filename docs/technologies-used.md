# 🛠️ Tecnologías Utilizadas

Para desarrollar **Almuerza Perú**, se han integrado tecnologías modernas tanto para el frontend como para herramientas de calidad, pruebas y automatización. El proyecto utiliza Angular 18 con arquitectura de standalone components y configuración moderna.

<p align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular Logo" width="80" />
</p>

## 🎯 Frontend

| Herramienta                | Versión | Descripción                                                                                                    |
| -------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| **Angular**                | 18.2.13 | Framework principal para construir aplicaciones SPA y PWAs escalables y robustas.                              |
| **Angular Material**       | 18.2.13 | Biblioteca de componentes UI basada en Material Design, moderna, accesible y bien integrada con Angular.       |
| **Angular CDK**            | 18.2.13 | Component Development Kit que proporciona primitivas y herramientas para construir componentes personalizados. |
| **Angular Service Worker** | 18.2.13 | Funcionalidades PWA para caching y funcionamiento offline.                                                     |
| **Angular SSR**            | 18.2.20 | Server-Side Rendering para mejorar SEO y rendimiento inicial.                                                  |
| **Tailwind CSS**           | 3.4.17  | Framework de utilidades para estilos altamente personalizables y modernos sin escribir CSS tradicional.        |
| **Tailwind CSS Animate**   | 1.0.7   | Extensión de Tailwind para animaciones predefinidas.                                                           |
| **Express**                | 4.21.2  | Framework para el servidor Node.js y SSR.                                                                      |
| **TypeScript**             | 5.5.4   | Lenguaje tipado para desarrollo robusto y escalable en Angular.                                                |
| **RxJS**                   | 7.8.1   | Librería para programación reactiva y manejo de streams en Angular.                                            |
| **PostCSS**                | 8.4.38  | Herramienta para transformar CSS con plugins, incluyendo Autoprefixer para compatibilidad entre navegadores.   |
| **Autoprefixer**           | 10.4.21 | Plugin de PostCSS que añade prefijos de navegador automáticamente.                                             |

&nbsp;

## 📦 Gestión de Dependencias

| Herramienta        | Versión | Descripción                                                                  |
| ------------------ | ------- | ---------------------------------------------------------------------------- |
| **npm**            | -       | Sistema de gestión de paquetes y dependencias del ecosistema JavaScript.     |
| **Angular CLI**    | 18.2.13 | Interfaz de línea de comandos para scaffolding, builds y utilidades Angular. |
| **Angular DevKit** | 18.2.20 | Herramientas de desarrollo y construcción para proyectos Angular.            |

&nbsp;

## 🧪 Pruebas y Cobertura

Este proyecto incluye herramientas para asegurar la calidad del código a través de pruebas unitarias y E2E:

| Herramienta               | Versión | Propósito                                                                                                         |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| **Jest**                  | 29.7.0  | Framework moderno para pruebas unitarias en JavaScript/TypeScript, rápido y con excelente integración en Angular. |
| **Jest Preset Angular**   | 14.2.4  | Configuración preestablecida de Jest optimizada para proyectos Angular.                                           |
| **Angular Builders Jest** | 18.0.0  | Constructor personalizado para integrar Jest con Angular CLI.                                                     |
| **Playwright**            | 1.54.1  | Herramienta para pruebas end-to-end (E2E) moderna y multiplataforma.                                              |
| **ts-jest**               | 29.1.1  | Transformador TypeScript para Jest que permite ejecutar pruebas en TypeScript.                                    |

&nbsp;

## 🧹 Calidad de Código y Automatización

Para mantener el código limpio, consistente y profesional, se utilizan estas herramientas de validación automática:

| Herramienta     | Versión | Descripción                                                                                                               |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Biome**       | 2.0.6   | Linter y formateador para TypeScript, HTML y SCSS. Detecta errores y asegura estilo uniforme en el código fuente.         |
| **Prettier**    | 3.6.2   | Formateador de código para HTML y SCSS, complementa a Biome en estilos y legibilidad.                                     |
| **Husky**       | 9.1.7   | Ejecuta scripts automáticos en los Git Hooks, como validaciones y formateo antes de cada commit.                          |
| **Lint-staged** | 16.1.2  | Ejecuta Biome y Prettier solo en los archivos modificados, acelerando validaciones previas al commit.                     |
| **Commitlint**  | 19.8.1  | Valida que los mensajes de commit sigan el estándar Conventional Commits.                                                 |
| **SonarCloud**  | -       | Análisis continuo de calidad y seguridad de código, con reportes de bugs, duplicaciones y cobertura desde GitHub Actions. |

> Todas estas herramientas están integradas con **Husky** para funcionar automáticamente antes de cada commit. Esto garantiza que el historial del repositorio sea limpio, coherente y fácil de mantener.

&nbsp;

## 🎯 Configuración Angular 18

### ⚡ Arquitectura Moderna

- **Standalone Components**: Eliminación de módulos tradicionales
- **ApplicationConfig**: Configuración basada en providers
- **Tree Shaking**: Optimización automática de bundles
- **Zone.js**: Correctamente configurado en polyfills

### 🔄 Server-Side Rendering

- **Angular Universal**: Implementado con `@angular/ssr`
- **Express Server**: Node.js para servir la aplicación
- **Hydration**: Cliente-servidor sincronizado
- **Build optimizado**: 553.14 kB inicial

### 📱 Progressive Web App

- **Service Worker**: Funcionalidad offline
- **Manifest**: Configurado para instalación
- **Material Theme**: Indigo-Pink precompilado
- **Performance**: Optimizado para dispositivos móviles

## &nbsp;

© Almuerza Perú – 2025
