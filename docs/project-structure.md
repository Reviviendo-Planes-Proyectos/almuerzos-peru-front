# 📁 Estructura del Proyecto

La estructura de **Almuerza Perú** está optimizada para máxima escalabilidad, claridad y mantenibilidad, siguiendo las mejores prácticas de Angular 18, Clean Architecture, SSR y automatización moderna.

```bash
almuerzos-peru-front/
│
├── angular.json              # ⚙️ Configuración principal de Angular
├── biome.json                # ⚙️ Configuración de Biome (lint/format)
├── jest.config.js            # ⚙️ Configuración de Jest
├── package.json              # 📦 Dependencias, scripts y build info
├── README.md                 # 📘 Documentación principal
├── server.ts                 # 🚀 Servidor Express para SSR
├── tailwind.config.js        # ⚙️ Configuración de TailwindCSS
├── tsconfig.json             # ⚙️ Configuración global de TypeScript
├── tsconfig.app.json         # ⚙️ Configuración TS para la app
├── tsconfig.spec.json        # ⚙️ Configuración TS para pruebas
├── .lintstagedrc.js          # 🧹 Configuración de lint-staged
├── .commitlintrc.js          # 📝 Reglas de commitlint
├── .husky/                   # 🐶 Git hooks para calidad
│
├── coverage/                 # 🧪 Reportes de cobertura de pruebas
├── docs/                     # 📚 Documentación adicional y diagramas
├── e2e/                      # 🧪 Pruebas end-to-end con Playwright
│   └── tests/                # Archivos de pruebas E2E
├── node_modules/             # 📦 Dependencias instaladas por npm
│
├── public/                   # 🌐 Archivos públicos (favicon, imágenes)
├── src/
│   ├── app/
│   │   ├── core/             # 🧠 Lógica transversal y servicios globales
│   │   │   ├── config/         # 🎯 Constantes, rutas API, claves, etc.
│   │   │   ├── guards/         # 🔐 Route guards para autenticación, permisos
│   │   │   ├── interceptors/   # 🌐 HTTP interceptors globales
│   │   │   ├── models/         # 🗂️ Interfaces/DTOs comunes
│   │   │   ├── services/       # 🛠️ Servicios singleton globales
│   │   │   ├── utils/          # 🧮 Funciones utilitarias
│   │   │   └── core.module.ts  # 🔁 Exporta/importa core
│   │   ├── shared/           # 🎨 Componentes y lógica reutilizable
│   │   │   ├── components/     # 🧱 Componentes visuales (botones, loaders, etc.)
│   │   │   ├── pipes/          # 🔄 Pipes globales
│   │   │   ├── directives/     # ➕ Directivas reutilizables
│   │   │   └── shared.module.ts# 📦 Exporta/importa shared
│   │   ├── features/         # 🧩 Módulos funcionales (dominios de negocio)
│   │   │   ├── auth/           # 🔐 Autenticación y registro
│   │   │   ├── restaurants/    # 🍽️ Gestión de restaurantes
│   │   │   ├── menus/          # 📅 Gestión de menús diarios
│   │   │   ├── dashboard/      # 📊 Panel de control
│   │   │   └── ...             # Otros features
│   │   ├── app.routes.ts        # �️ Rutas principales
│   │   ├── app.component.ts     # 🏠 Componente raíz
│   │   ├── app.component.html   # 📄 Layout base
│   │   ├── app.component.scss   # 🎨 Estilos globales
│   │   ├── app.config.ts        # ⚙️ Configuraciones globales
│   │   ├── app.config.server.ts # 🛠️ Configs SSR/backend
│   │   └── ...
│   ├── assets/                # 🖼️ Imágenes, íconos, tipografías
│   ├── environments/          # 🌎 Variables por entorno (dev, prod)
│   └── index.html             # 🚪 Punto de entrada HTML
```

│ │ │ └── core.module.ts # 🔁 Importa y exporta los elementos core a toda la app.
│ │
│ │ ├── shared/ # 🎨 Elementos reutilizables de UI o lógica simple.
│ │ │ ├── components/ # 🧱 Componentes visuales: botones, inputs, loaders, modales.
│ │ │ ├── pipes/ # 🔄 Pipes globales: formatear precios, capitalizar texto, etc.
│ │ │ ├── directives/ # ➕ Directivas como autofocus, restricción de caracteres, etc.
│ │ │ └── shared.module.ts # 📦 Módulo para importar/exportar lo anterior en otros features.
│ │
│ │ ├── features/ # 🧩 Módulos funcionales que representan "dominios de negocio".

```bash
almuerzos-peru-front/
│
├── angular.json              # ⚙️ Configuración principal de Angular
├── biome.json                # ⚙️ Configuración de Biome (lint/format)
├── jest.config.js            # ⚙️ Configuración de Jest
├── package.json              # � Dependencias, scripts y build info
├── README.md                 # 📘 Documentación principal
├── server.ts                 # � Servidor Express para SSR
├── tailwind.config.js        # ⚙️ Configuración de TailwindCSS
├── tsconfig.json             # ⚙️ Configuración global de TypeScript
├── tsconfig.app.json         # ⚙️ Configuración TS para la app
├── tsconfig.spec.json        # ⚙️ Configuración TS para pruebas
│
├── coverage/                 # 🧪 Reportes de cobertura de pruebas
├── docs/                     # 📚 Documentación adicional y diagramas
├── e2e/                      # � Pruebas end-to-end con Playwright
│   └── tests/                # Archivos de pruebas E2E
├── node_modules/             # 📦 Dependencias instaladas por npm
│
├── public/                   # 🌐 Archivos públicos (favicon, imágenes)
├── src/
│   ├── app/
│   │   ├── core/             # 🧠 Lógica transversal y servicios globales
│   │   │   ├── config/         # 🎯 Constantes, rutas API, claves, etc.
│   │   │   ├── guards/         # 🔐 Route guards para autenticación, permisos
│   │   │   ├── interceptors/   # 🌐 HTTP interceptors globales
│   │   │   ├── models/         # 🗂️ Interfaces/DTOs comunes
│   │   │   ├── services/       # �️ Servicios singleton globales
│   │   │   ├── utils/          # 🧮 Funciones utilitarias
│   │   │   └── core.module.ts  # 🔁 Exporta/importa core
│   │   ├── shared/           # 🎨 Componentes y lógica reutilizable
│   │   │   ├── components/     # 🧱 Componentes visuales (botones, loaders, etc.)
│   │   │   ├── pipes/          # � Pipes globales
│   │   │   ├── directives/     # ➕ Directivas reutilizables
│   │   │   └── shared.module.ts# 📦 Exporta/importa shared
│   │   ├── features/         # � Módulos funcionales (dominios de negocio)
│   │   │   ├── auth/           # 🔐 Autenticación y registro
│   │   │   ├── restaurants/    # �️ Gestión de restaurantes
│   │   │   ├── menus/          # � Gestión de menús diarios
│   │   │   ├── dashboard/      # 📊 Panel de control
│   │   │   └── ...             # Otros features
│   │   ├── app.routes.ts      # � Rutas principales
│   │   ├── app.component.ts   # � Componente raíz
│   │   ├── app.component.html # 📄 Layout base
│   │   ├── app.component.scss # 🎨 Estilos globales
│   │   ├── app.config.ts      # ⚙️ Configuraciones globales
│   │   ├── app.config.server.ts# 🛠️ Configs SSR/backend
│   │   └── ...
│   ├── assets/                # 🖼️ Imágenes, íconos, tipografías
│   ├── environments/          # 🌎 Variables por entorno (dev, prod)
│   └── index.html             # 🚪 Punto de entrada HTML
│
├── angular.json              # ⚙️ Config del proyecto Angular
├── package.json              # 📦 Dependencias, scripts, build info
└── README.md                 # 📘 Documentación principal
```

&nbsp;

---

© 2025 Almuerzos Perú
