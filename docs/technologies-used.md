# 🛠️ Tecnologías Utilizadas

Para desarrollar **Almuerza Perú**, se han integrado tecnologías modernas tanto para el frontend como para herramientas de calidad, pruebas y automatización.

<p align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular Logo" width="80" />
</p>


## 🎯 Frontend

| Herramienta           | Descripción                                                                                                                                |
|-----------------------|-----------------------------------------------------------------------------------------------------------------                           |
| **Angular 18.2.2**    | Framework principal para construir aplicaciones SPA y PWAs escalables y robustas.                                                          |
| **PWA**               | Implementación como Progressive Web App: permite instalación y uso offline mediante `service workers`.                                     |
| **Angular Material**  | Biblioteca de componentes UI basada en Material Design, moderna, accesible y bien integrada con Angular.                                   |
| **Tailwind CSS**      | Framework de utilidades para estilos altamente personalizables y modernos sin escribir CSS tradicional.                                    |
| **NGPrime**           | Colección de componentes UI avanzados (tablas, calendarios, gráficos, etc.) optimizados para Angular. *(no está configurada actualmente)*  |

&nbsp;

## 📦 Gestión de Dependencias

| Herramienta       | Descripción                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **npm**           | Sistema de gestión de paquetes y dependencias del ecosistema JavaScript.    |
| **Angular CLI**   | Interfaz de línea de comandos para scaffolding, builds y utilidades Angular.|

&nbsp;

## 🧪 Cobertura de Pruebas

Este proyecto incluye herramientas para asegurar la calidad del código a través de pruebas unitarias y E2E:

| Herramienta     | Propósito                                                                                                  |
|-----------------|------------------------------------------------------------------------------------------------------------|
| **Jasmine**     | Framework utilizado por defecto en Angular para escribir pruebas unitarias claras y estructuradas.         |
| **Karma**       | Ejecuta las pruebas unitarias en navegadores reales y genera reportes de cobertura.                        |
| **Protractor**  | Herramienta para pruebas end-to-end (E2E) en Angular. *(no está configurada actualmente)*        |

&nbsp;

## 🧹 Calidad de Código y Automatización

Para mantener el código limpio, consistente y profesional, se utilizan estas herramientas de validación automática:

| Herramienta        | Descripción                                                                                                                                        |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Biome**          | Herramienta única para linting y formateo que asegura un estilo uniforme y detecta errores en TypeScript, HTML y SCSS.                                                                  |
| **Husky**          | Permite ejecutar scripts automáticos en los Git Hooks, como validar código antes de cada commit.                                                   |
| **Lint-staged**    | Ejecuta Biome **solo en los archivos modificados**, lo que acelera validaciones previas al commit.                                                 |
| **Commitlint**     | Asegura que los mensajes de commit sigan el estándar `Conventional Commits` (ej: `feat(menu): add daily specials section`).                        |
| **SonarCloud**     | Plataforma de análisis continuo de calidad y seguridad de código. Evalúa bugs, code smells, duplicaciones, y cobertura desde GitHub Actions.       |

> Todas estas herramientas están integradas con **Husky** para funcionar automáticamente antes de cada commit. Esto garantiza que el historial del repositorio sea limpio, coherente y fácil de mantener.

&nbsp;
---

© Almuerza Perú – 2025
