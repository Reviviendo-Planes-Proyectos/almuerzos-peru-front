# Almuerza Perú - Proyecto Web

![Angular](https://img.shields.io/badge/angular-18.2.13-red?logo=angular)
![TypeScript](https://img.shields.io/badge/typescript-5.5.4-blue?logo=typescript)
![Jest](https://img.shields.io/badge/jest-29.7.0-green?logo=jest)
![Playwright](https://img.shields.io/badge/playwright-1.54.1-green?logo=playwright)
![Biome](https://img.shields.io/badge/biome-2.0.6-yellow?logo=biome)
![Prettier](https://img.shields.io/badge/prettier-3.6.2-ff69b4?logo=prettier)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

**Almuerza Perú** es una **Progressive Web App (PWA)** moderna y responsiva, diseñada para digitalizar y visibilizar los menús diarios de restaurantes locales, permitiendo a los comensales encontrar opciones cercanas de manera rápida y atractiva. El proyecto está construido con Angular 18, SSR, PWA, Tailwind CSS, testing integral y las mejores prácticas de calidad de código.

&nbsp;

## 📚 Tabla de Contenidos

- [📱 Tipo de Aplicación](./docs/pwa-application.md)
- [🧱 Arquitectura del Proyecto](./docs/architecture.md)
- [🛠️ Tecnologías Utilizadas](./docs/technologies-used.md)
- [📁 Estructura del Proyecto](./docs/project-structure.md)
- [🚦 GitFlow, Branches, Pull Request y Changelog](./docs/gitflow-changelog.md)
- [💻 Requisitos del Sistema](#requisitos-del-sistema)
- [🚀 Instalación y Ejecución](#instalacion-y-ejecucion)
- [🔧 Comandos Útiles](#comandos-utiles)
- [📦 Dependencias](#dependencias)
- [✅ Estado del Proyecto](#estado-del-proyecto)
- [📚 Documentación Adicional](#documentacion-adicional)

&nbsp;

## 💻 Requisitos del Sistema

Antes de instalar y ejecutar el proyecto, asegúrate de tener instalado en tu computadora:

### 📋 Requisitos Obligatorios

| Software    | Versión Mínima | Versión Recomendada | Descripción                                     |
| ----------- | -------------- | ------------------- | ----------------------------------------------- |
| **Node.js** | 18.18.0        | 20.10.0 o superior  | Runtime de JavaScript para ejecutar el proyecto |
| **npm**     | 9.0.0          | 10.0.0 o superior   | Gestor de paquetes (incluido con Node.js)       |
| **Git**     | 2.25.0         | 2.40.0 o superior   | Control de versiones                            |

### 🛠️ Herramientas Opcionales (Recomendadas)

| Software               | Versión        | Descripción                                    |
| ---------------------- | -------------- | ---------------------------------------------- |
| **Angular CLI**        | ^18.2.13       | Herramientas de línea de comandos para Angular |
| **Visual Studio Code** | Última versión | Editor de código recomendado con extensiones   |
| **Chrome DevTools**    | Última versión | Para debugging y desarrollo PWA                |
| **Biome**              | ^2.0.6         | Linter y formateador de código                 |
| **Prettier**           | ^3.6.2         | Formateador adicional para HTML y SCSS         |

### 🔍 Verificar Instalación

Ejecuta estos comandos para verificar que tienes las versiones correctas:

```bash
# Verificar Node.js
node --version
# Resultado esperado: v18.18.0 o superior

# Verificar npm
npm --version
# Resultado esperado: 9.0.0 o superior

# Verificar Git
git --version
# Resultado esperado: 2.25.0 o superior

# Instalar Angular CLI globalmente (opcional)
npm install -g @angular/cli@18.2.13
ng version
```

### 📥 Instalación de Node.js

Si no tienes Node.js instalado:

1. **Windows**: Descarga desde [nodejs.org](https://nodejs.org/) o usa [nvm-windows](https://github.com/coreybutler/nvm-windows)
2. **macOS**: Descarga desde [nodejs.org](https://nodejs.org/) o usa Homebrew: `brew install node`
3. **Linux (Ubuntu/Debian)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

&nbsp;

## 🚀 Instalación y Ejecución

Una vez que tengas todos los requisitos instalados, sigue estos pasos:

### 📥 Clonar e Instalar

```bash
# Clonar el repositorio
git clone https://github.com/Reviviendo-Planes-Proyectos/almuerzos-peru-front.git

# Navegar al directorio
cd almuerzos-peru-front

# Instalar dependencias
npm install

# Configurar Husky (Git hooks)
npm run prepare

# Iniciar servidor de desarrollo
npm start
```

### ⚙️ Configuración Adicional

El proyecto incluye configuración preestablecida para:

- **Tailwind CSS**: Framework CSS utilitario con tema personalizado
- **Jest**: Testing framework con configuración Angular optimizada
- **Playwright**: Testing end-to-end moderno
- **Biome**: Linter y formateador de código
- **Prettier**: Formateador adicional para HTML y SCSS
- **Husky**: Git hooks para calidad de código
- **lint-staged**: Linting automático en archivos staged
- **Commitlint**: Validación de mensajes de commit
- **PWA**: Service worker y manifest configurados
- **SSR**: Server-Side Rendering con Express

### 🌐 Acceder a la Aplicación

📍 **Desarrollo**: La aplicación estará disponible en [http://localhost:4200](http://localhost:4200)
📍 **SSR Producción**: Servidor con Server-Side Rendering en [http://localhost:4000](http://localhost:4000) (después de ejecutar `npm run build:serve:ssr`)

&nbsp;

## 🔧 Comandos Útiles

### 🚀 Desarrollo y Construcción

| Comando                   | Descripción                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `npm run ng`              | Ejecuta comandos Angular CLI directamente                       |
| `npm start`               | Inicia la aplicación Angular en modo desarrollo (`ng serve`)    |
| `npm run build`           | Compila la aplicación para producción (`ng build`)              |
| `npm run build:ssr`       | Compila la aplicación con SSR habilitado para producción        |
| `npm run serve:ssr`       | Ejecuta el servidor SSR compilado en puerto 4000                |
| `npm run build:serve:ssr` | Compila y ejecuta la aplicación con SSR en un solo comando      |
| `npm run watch`           | Compila en modo observador para desarrollo (`ng build --watch`) |

### 🧪 Testing

| Comando                   | Descripción                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `npm test`                | Ejecuta pruebas unitarias con Jest                             |
| `npm run test:watch`      | Ejecuta pruebas unitarias en modo observador con Jest          |
| `npm run test:coverage`   | Ejecuta pruebas unitarias con reporte de cobertura usando Jest |
| `npm run test:ci`         | Ejecuta pruebas en modo CI con cobertura y sin observador      |
| `npm run test:e2e`        | Ejecuta pruebas end-to-end con Playwright                      |
| `npm run test:e2e:ui`     | Ejecuta la interfaz de Playwright para pruebas E2E             |
| `npm run test:e2e:report` | Muestra el reporte de pruebas E2E de Playwright                |

### 🔧 Calidad de Código

| Comando                   | Descripción                                                  |
| ------------------------- | ------------------------------------------------------------ |
| `npm run lint`            | Ejecuta Biome para analizar el código fuente                 |
| `npm run lint:fix`        | Ejecuta Biome para corregir problemas automáticamente        |
| `npm run lint-staged`     | Ejecuta lint-staged para analizar solo los archivos en stage |
| `npm run format`          | Aplica Biome y Prettier para formatear archivos              |
| `npm run format:biome`    | Formatea archivos con Biome                                  |
| `npm run format:prettier` | Formatea archivos HTML y SCSS con Prettier                   |
| `npm run prepare`         | Inicializa Husky y configura los Git Hooks                   |

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
| `tailwindcss`             | ^3.4.17  | Framework CSS utilitario                |
| `tailwindcss-animate`     | ^1.0.7   | Animaciones para Tailwind CSS           |
| `tslib`                   | ^2.6.3   | Librería de utilidades de TypeScript    |
| `zone.js`                 | ~0.14.10 | Detección de cambios para Angular       |

### 🛠️ Dependencias de Desarrollo

| Dependencia                       | Versión  | Descripción                        |
| --------------------------------- | -------- | ---------------------------------- |
| `@angular/cli`                    | ^18.2.13 | Herramientas de línea de comandos  |
| `@angular-builders/jest`          | ^18.0.0  | Constructor Jest para Angular      |
| `@angular-devkit/build-angular`   | ^18.2.20 | Herramientas de construcción       |
| `@angular/compiler-cli`           | ^18.2.13 | Compilador de Angular CLI          |
| `jest`                            | ^29.7.0  | Framework de testing               |
| `jest-preset-angular`             | ^14.2.4  | Configuración Jest para Angular    |
| `@playwright/test`                | ^1.54.1  | Testing end-to-end                 |
| `@biomejs/biome`                  | ^2.0.6   | Linter y formateador de código     |
| `prettier`                        | ^3.6.2   | Formateador de código              |
| `tailwindcss`                     | ^3.4.17  | Framework CSS utilitario           |
| `husky`                           | ^9.1.7   | Git hooks                          |
| `lint-staged`                     | ^16.1.2  | Linting en archivos staged         |
| `@commitlint/cli`                 | ^19.8.1  | Validación de mensajes de commit   |
| `@commitlint/config-conventional` | ^19.8.1  | Configuración convencional commit  |
| `typescript`                      | ~5.5.4   | Superset tipado de JavaScript      |
| `@types/express`                  | ^4.17.23 | Tipos TypeScript para Express      |
| `@types/jest`                     | ^29.5.12 | Tipos TypeScript para Jest         |
| `@types/node`                     | ^18.18.0 | Tipos TypeScript para Node.js      |
| `autoprefixer`                    | ^10.4.21 | Prefijos CSS automáticos           |
| `postcss`                         | ^8.4.38  | Herramienta de transformación CSS  |
| `ts-jest`                         | ^29.1.1  | Transformador TypeScript para Jest |

&nbsp;

## ✅ Estado del Proyecto

### 🧪 Testing

- **21 test suites**: ✅ Todos pasando
- **146 tests**: ✅ Todos ejecutándose correctamente
- **Cobertura**: 99.64% - Excelente cobertura de código

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
- 🧹 **Biome + Prettier**: Linting y formateo automático
- 🔒 **Husky + lint-staged + Commitlint**: Calidad y seguridad en los commits

### 📱 Funcionalidades PWA

- **Instalación Automática**: Prompt de instalación aparece automáticamente después de 3 segundos
- **Diseño Premium**: Gradiente 3D animado, glassmorphism y animaciones bouncy
- **Instalación Inteligente**: Respeta preferencias del usuario (no molesta por 24h si se rechaza)
- **Botón Flotante**: FAB animado y con efectos hover
- **Service Worker**: Cacheo offline y actualizaciones automáticas
- **Manifest Configurado**: Iconos, tema y configuración de instalación completa
- **Compatibilidad SSR**: Funciona correctamente con Server-Side Rendering
- **Responsive Premium**: Adaptación total a móviles con animaciones fluidas
- **Efectos Visuales**: Shimmer, pulse, gradientes fluidos y animaciones premium

&nbsp;

## 📚 Documentación Adicional

### 📖 Guías de Arquitectura y Desarrollo

- [📐 Arquitectura del Proyecto](docs/architecture.md) — Estructura y patrones de diseño (Clean Architecture + Component-Based)
- [⚙️ Tecnologías Utilizadas](docs/technologies-used.md) — Stack tecnológico detallado y justificación
- [📁 Estructura del Proyecto](docs/project-structure.md) — Organización de archivos y carpetas
- [🧹 Calidad de Código y Automatización](docs/code-quality.md) — Uso de Husky, Commitlint, lint-staged, Biome y Prettier

### 📱 Configuración PWA

- [📱 Configuración PWA](docs/pwa-application.md) — Progressive Web App setup y características
- [🔄 PWA Prompt Automático](docs/pwa-auto-prompt.md) — Configuración y personalización del prompt de instalación

### 🚀 Características Principales

- **Lazy Loading**: Módulos cargados bajo demanda para mejor rendimiento
- **SSR (Server-Side Rendering)**: Renderizado del lado del servidor con Express
- **PWA Ready**: Instalable como aplicación nativa
- **Testing Completo**: Cobertura del 99.64% con Jest + Playwright
- **Code Quality**: Biome + Prettier + Husky para calidad de código
- **Tailwind CSS**: Framework CSS utilitario con configuración personalizada

&nbsp;

---

© 2025 Almuerzos Perú
