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

| Comando                              | Descripción                                                                 |
|--------------------------------------|-----------------------------------------------------------------------------|
| `npm start`                          | Inicia la aplicación Angular en modo desarrollo (`ng serve`).              |
| `npm run build`                      | Compila la aplicación para producción (`ng build`).                        |
| `npm run watch`                      | Compila en modo observador para desarrollo (`ng build --watch`).          |
| `npm test`                           | Ejecuta pruebas unitarias con Jest.                                        |
| `npm run test:watch`                 | Ejecuta pruebas en modo observador con Jest.                               |
| `npm run test:coverage`              | Ejecuta pruebas con reporte de cobertura usando Jest.                      |
| `npm run lint`                       | Ejecuta Biome para analizar el código.                                      |
| `npm run lint:fix`                   | Ejecuta Biome para corregir problemas automáticamente.                      |
| `npm run format`                     | Aplica Biome para formatear archivos.                                       |
| `npm run prepare`                    | Inicializa Husky para configurar los Git Hooks.                            |
| `npm run serve:ssr:almuerzos-peru-front` | Inicia el servidor SSR en producción desde la carpeta `dist/`.         |
| `npm run test:ci`                   | Ejecuta pruebas en modo CI con cobertura y sin observador.                 |


&nbsp;
---

© 2025 Almuerza Perú