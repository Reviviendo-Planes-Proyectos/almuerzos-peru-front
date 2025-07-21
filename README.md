# Almuerza Perú - Proyecto Web

![Angular](https://img.shields.io/badge/angular-18.2.13-red?logo=angular)
![TypeScript](https://img.shields.io/badge/typescript-5.5.4-blue?logo=typescript)
![Jest](https://img.shields.io/badge/jest-29.7.0-green?logo=jest)
![Playwright](https://img.shields.io/badge/playwright-1.54.1-green?logo=playwright)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

**Almuerza Perú** es una **Progressive Web App (PWA)** diseñada para revolucionar la forma en que los restaurantes locales muestran sus menús diarios, brindando visibilidad en línea a pequeños restaurantes y mejorando la experiencia de los comensales al permitirles encontrar rápidamente opciones de menú cerca de su ubicación.

## 📚 Tabla de Contenidos

- [📱 Tipo de Aplicación](./docs/pwa-application.md)
- [🧱 Arquitectura del Proyecto](./docs/architecture.md)
  - Clean Architecture
  - Component-Based Architecture
  - Modularización y Lazy Loading
- [🛠️ Tecnologías Utilizadas](./docs/technologies-used.md)
  - Frontend
  - Gestión de Dependencias
  - Cobertura de Pruebas
  - Calidad de Código y Automatización de Commits
- [🚀 Instalación y Ejecución](#-instalación-y-ejecución)
- [🔧 Comandos Útiles](#-comandos-útiles)
- [📁 Estructura del Proyecto](./docs/project-structure.md)
- [📦 Dependencias](#-dependencias)
- [✅ Estado del Proyecto](#-estado-del-proyecto)

&nbsp;

## 📦 Dependencias

### 🚀 Dependencias Principales

| Dependencia               | Versión  | Descripción                             |
| ------------------------- | -------- | --------------------------------------- |
| `@angular/core`           | ^18.2.13 | Framework principal de Angular          |
| `@angular/common`         | ^18.2.13 | Módulos comunes de Angular              |
| `@angular/router`         | ^18.2.13 | Sistema de enrutamiento de Angular      |
| `@angular/forms`          | ^18.2.13 | Formularios reactivos y template-driven |
| `@angular/animations`     | ^18.2.13 | Animaciones de Angular                  |
| `@angular/material`       | ^18.2.13 | Componentes de Material Design          |
| `@angular/cdk`            | ^18.2.13 | Component Development Kit               |
| `@angular/service-worker` | ^18.2.13 | Service Worker para PWA                 |
| `@angular/ssr`            | ^18.2.20 | Server-Side Rendering                   |
| `rxjs`                    | ~7.8.1   | Programación reactiva con observables   |
| `express`                 | ^4.21.2  | Servidor web para SSR                   |
| `tailwindcss-animate`     | ^1.0.7   | Animaciones para Tailwind CSS           |

### 🛠️ Dependencias de Desarrollo

| Dependencia              | Versión  | Descripción                       |
| ------------------------ | -------- | --------------------------------- |
| `@angular/cli`           | ^18.2.13 | Herramientas de línea de comandos |
| `@angular-builders/jest` | ^18.0.0  | Constructor Jest para Angular     |
| `jest`                   | ^29.7.0  | Framework de testing              |
| `jest-preset-angular`    | ^14.2.4  | Configuración Jest para Angular   |
| `@playwright/test`       | ^1.54.1  | Testing end-to-end                |
| `@biomejs/biome`         | ^2.0.6   | Linter y formateador de código    |
| `prettier`               | ^3.6.2   | Formateador de código             |
| `tailwindcss`            | ^3.4.17  | Framework CSS utilitario          |
| `husky`                  | ^9.1.7   | Git hooks                         |
| `lint-staged`            | ^16.1.2  | Linting en archivos staged        |
| `@commitlint/cli`        | ^19.8.1  | Validación de mensajes de commit  |
| `typescript`             | ~5.5.4   | Superset tipado de JavaScript     |

&nbsp;

## 🚀 Instalación y Ejecución

Sigue estos pasos para clonar y levantar el proyecto localmente:

**Clonar el repositorio**:

```bash
   git clone https://github.com/Reviviendo-Planes-Proyectos/almuerzos-peru-front.git
   cd almuerzos-peru-front
   npm install
   npm start
```

📍 La aplicación estará disponible en http://localhost:4200/.

&nbsp;

## 🔧 Comandos Útiles

### 🚀 Desarrollo y Construcción

| Comando                   | Descripción                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| `npm start`               | Inicia la aplicación Angular en modo desarrollo (`ng serve`).    |
| `npm run build`           | Compila la aplicación para producción (`ng build`).              |
| `npm run build:ssr`       | Compila la aplicación con Server-Side Rendering para producción. |
| `npm run serve:ssr`       | Ejecuta el servidor SSR compilado.                               |
| `npm run build:serve:ssr` | Compila y ejecuta la aplicación con SSR en un solo comando.      |
| `npm run watch`           | Compila en modo observador para desarrollo (`ng build --watch`). |

### 🧪 Testing

| Comando                   | Descripción                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `npm test`                | Ejecuta pruebas unitarias con Jest.                             |
| `npm run test:watch`      | Ejecuta pruebas unitarias en modo observador con Jest.          |
| `npm run test:coverage`   | Ejecuta pruebas unitarias con reporte de cobertura usando Jest. |
| `npm run test:ci`         | Ejecuta pruebas en modo CI con cobertura y sin observador.      |
| `npm run test:e2e`        | Ejecuta pruebas end-to-end con Playwright.                      |
| `npm run test:e2e:ui`     | Ejecuta la interfaz de Playwright para pruebas E2E.             |
| `npm run test:e2e:report` | Muestra el reporte de pruebas E2E de Playwright.                |

### 🔧 Calidad de Código

| Comando                   | Descripción                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `npm run lint`            | Ejecuta Biome para analizar el código fuente.                 |
| `npm run lint:fix`        | Ejecuta Biome para corregir problemas automáticamente.        |
| `npm run lint-staged`     | Ejecuta lint-staged para analizar solo los archivos en stage. |
| `npm run format`          | Aplica Biome y Prettier para formatear archivos.              |
| `npm run format:biome`    | Formatea archivos con Biome.                                  |
| `npm run format:prettier` | Formatea archivos HTML y SCSS con Prettier.                   |
| `npm run prepare`         | Inicializa Husky para configurar los Git Hooks.               |

&nbsp;

## ✅ Estado del Proyecto

### 🚀 Servidores Disponibles

- **Desarrollo**: `http://localhost:4200` - Servidor de desarrollo con hot reload
- **SSR Producción**: `http://localhost:4000` - Servidor con Server-Side Rendering (solo en build de producción)

### 🧪 Testing

- **19 test suites**: ✅ Todos pasando
- **84 tests**: ✅ Todos ejecutándose correctamente
- **Cobertura**: Disponible con `npm run test:coverage`

### 📊 Build & Performance

- **Bundle inicial**: 232.69 kB optimizado
- **Zone.js**: 90.20 kB incluido correctamente
- **SSR**: Disponible en producción con `npm run build:ssr`
- **Lazy Loading**: Implementado en todos los módulos

### 🔧 Características Técnicas

- ⚡ **Angular 18.2.13**: Standalone Components y configuración moderna
- 🎨 **Angular Material**: Tema precompilado Indigo-Pink
- 📱 **PWA Ready**: Progressive Web App con manifest configurado
- 🔄 **SSR Completo**: Server-Side Rendering con Express
- 🧪 **Testing Completo**: Jest + Playwright para testing integral
- 🎯 **TypeScript**: Tipado fuerte con versión 5.5.4

### 📱 Funcionalidades PWA

- **Instalación Automática**: Prompt de instalación aparece automáticamente después de 3 segundos
- **Diseño Premium**: Gradiente 3D animado con efectos glassmorphism y animaciones bouncy
- **Instalación Inteligente**: Respeta las preferencias del usuario (no molesta por 24 horas si se rechaza)
- **Botón Flotante**: FAB con animación de flotación y efectos hover espectaculares
- **Service Worker**: Cacheo offline y actualizaciones automáticas
- **Manifest Configurado**: Iconos, tema y configuración de instalación completa
- **Compatibilidad SSR**: Funciona correctamente con Server-Side Rendering
- **Responsive Premium**: Se adapta perfectamente a móviles con animaciones fluidas
- **Efectos Visuales**: Shimmer effects, pulse animations y gradientes fluidos

## &nbsp;

## 📚 Documentación Adicional

- [📐 Arquitectura del Proyecto](docs/architecture.md) - Estructura y patrones de diseño
- [⚙️ Tecnologías Utilizadas](docs/technologies-used.md) - Stack tecnológico detallado
- [📁 Estructura del Proyecto](docs/project-structure.md) - Organización de archivos y carpetas
- [📱 Configuración PWA](docs/pwa-application.md) - Progressive Web App setup
- [🔄 PWA Prompt Automático](docs/pwa-auto-prompt.md) - Configuración y personalización del prompt de instalación

&nbsp;

© 2025 Almuerza Perú
