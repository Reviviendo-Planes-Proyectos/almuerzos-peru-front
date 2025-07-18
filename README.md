# Almuerza Perú - Proyecto Web

![Angular](https://img.shields.io/badge/angular-18.2-red?logo=angular)
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
  - Calidad de Código y Automatización de Commitss
- [🚀 Instalación y Ejecución](#-instalación-y-ejecución)
- [🔧 Comandos Útiles](#-comandos-útiles)
- [📁 Estructura del Proyecto](./docs/project-structure.md)

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

| Comando                   | Descripción                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| `npm start`               | Inicia la aplicación Angular en modo desarrollo (`ng serve`).    |
| `npm run build`           | Compila la aplicación para producción (`ng build`).              |
| `npm run watch`           | Compila en modo observador para desarrollo (`ng build --watch`). |
| `npm test`                | Ejecuta pruebas unitarias con Jest.                              |
| `npm run test:watch`      | Ejecuta pruebas unitarias en modo observador con Jest.           |
| `npm run test:coverage`   | Ejecuta pruebas unitarias con reporte de cobertura usando Jest.  |
| `npm run test:ci`         | Ejecuta pruebas en modo CI con cobertura y sin observador.       |
| `npm run test:e2e`        | Ejecuta pruebas end-to-end con Playwright.                       |
| `npm run test:e2e:ui`     | Ejecuta la interfaz de Playwright para pruebas E2E.              |
| `npm run test:e2e:report` | Muestra el reporte de pruebas E2E de Playwright.                 |
| `npm run lint`            | Ejecuta Biome para analizar el código fuente.                    |
| `npm run lint:fix`        | Ejecuta Biome para corregir problemas automáticamente.           |
| `npm run lint-staged`     | Ejecuta lint-staged para analizar solo los archivos en stage.    |
| `npm run format`          | Aplica Biome y Prettier para formatear archivos.                 |
| `npm run format:biome`    | Formatea archivos con Biome.                                     |
| `npm run format:prettier` | Formatea archivos HTML y SCSS con Prettier.                      |
| `npm run prepare`         | Inicializa Husky para configurar los Git Hooks.                  |

## &nbsp;

© 2025 Almuerza Perú
