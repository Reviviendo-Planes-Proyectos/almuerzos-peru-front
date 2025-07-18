# 📁 Estructura del Proyecto

La estructura del proyecto se organiza de manera que permita una escalabilidad fácil, con una distinción clara entre componentes, servicios, módulos y configuración.

```bash
almuerzos-peru-front/
│
├── angular.json                    # ⚙️ Configuración principal de Angular.
├── biome.json                      # ⚙️ Configuración de Biome (lint/format).
├── jest.config.js                  # ⚙️ Configuración de Jest.
├── package.json                    # 📦 Dependencias, scripts y build info.
├── README.md                       # � Documentación básica del proyecto.
├── server.ts                       # 🚀 Servidor Express para SSR.
├── tailwind.config.js              # ⚙️ Configuración de TailwindCSS.
├── tsconfig.json                   # ⚙️ Configuración global de TypeScript.
├── tsconfig.app.json               # ⚙️ Configuración TS para la app.
├── tsconfig.spec.json              # ⚙️ Configuración TS para pruebas.
│
├── coverage/                       # � Reportes de cobertura de pruebas.
├── docs/                           # � Documentación adicional y diagramas.
├── e2e/                            # 🧪 Pruebas end-to-end con Playwright.
│   └── tests/                      # Archivos de pruebas E2E.
├── node_modules/                  # 📦 Dependencias instaladas por npm.
│
├── public/                         # 🌐 Archivos públicos (favicon, imágenes).
├── src/
│   ├── app/
│   │   ├── core/                   # 🧠 Lógica transversal: no depende de ningún feature. Reutilizable globalmente.
│   │   │   ├── config/             # 🎯 Configuraciones como constantes, rutas API, claves, etc.
│   │   │   ├── guards/             # 🔐 Route guards para autenticación, permisos, redirecciones.
│   │   │   ├── interceptors/       # 🌐 HTTP interceptors para tokens, errores globales, loaders.
│   │   │   ├── models/             # 🧾 Interfaces/DTOs comunes: User, Restaurant, MenuItem...
│   │   │   ├── services/           # 🛠️ Servicios singleton: autenticación, geolocalización, sesión.
│   │   │   ├── utils/              # 🧮 Funciones pequeñas reutilizables: formateo, validaciones.
│   │   │   └── core.module.ts      # 🔁 Importa y exporta los elementos core a toda la app.
│   │
│   │   ├── shared/                 # 🎨 Elementos reutilizables de UI o lógica simple.
│   │   │   ├── components/         # 🧱 Componentes visuales: botones, inputs, loaders, modales.
│   │   │   ├── pipes/              # 🔄 Pipes globales: formatear precios, capitalizar texto, etc.
│   │   │   ├── directives/         # ➕ Directivas como autofocus, restricción de caracteres, etc.
│   │   │   └── shared.module.ts    # 📦 Módulo para importar/exportar lo anterior en otros features.
│   │
│   │   ├── features/               # 🧩 Módulos funcionales que representan "dominios de negocio".
│   │   │
│   │   │   ├── auth/
│   │   │   │   ├── pages/          # 📄 login, registro. Son vistas completas con lógica propia.
│   │   │   │   ├── components/     # 👥 login-form, social-buttons, recovery-form.
│   │   │   │   ├── services/       # 🔐 auth.service.ts con métodos como login, register, logout.
│   │   │   │   ├── models/         # 🧾 Interfaces para credenciales, tokens, perfiles.
│   │   │   │   └── auth.module.ts  # 📦 Encapsula e importa todo lo anterior para el feature.
│   │   │
│   │   │   ├── restaurants/
│   │   │   │   ├── pages/          # 🧭 listados, perfil de restaurante, detalle de platos.
│   │   │   │   ├── components/     # 🧱 Tarjetas, sliders, mapa, banner.
│   │   │   │   ├── shared/         # 🔁 Pipes o directivas solo útiles en este módulo (e.g. ratingPipe).
│   │   │   │   ├── services/       # 🛠️ Lógica: restaurant.service.ts (GET/POST de restaurantes).
│   │   │   │   └── restaurant.module.ts
│   │   │
│   │   │   ├── menus/
│   │   │   │   ├── pages/          # 🧾 Página de edición del menú diario, visualización por día.
│   │   │   │   ├── components/     # 🧩 Componentes como lista de platos, ítems editables, header.
│   │   │   │   ├── shared/         # 🎛️ Por ejemplo: switch desayuno/almuerzo/cena, colorPicker.
│   │   │   │   ├── services/       # 📡 Llamadas a API para CRUD de menú diario.
│   │   │   │   └── menu.module.ts
│   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── pages/          # 🖥️ Página principal del panel de control del restaurante.
│   │   │   │   ├── components/     # 📊 Gráficas, resumen, botón de compartir menú.
│   │   │   │   └── dashboard.module.ts
│   │
│   │   ├── app.routes.ts           # 🧭 Define las rutas principales de la aplicación.
│   │   ├── app.component.ts        # 🌐 Componente raíz (base del DOM).
│   │   ├── app.component.html      # 📄 Layout inicial: navbar, router-outlet, footer.
│   │   ├── app.component.scss      # 🎨 Estilos globales base.
│   │   ├── app.module.ts           # 🧠 Módulo principal, importa `core`, `shared`, y `features`.
│   │   ├── app.component.scss      # 🎨 Estilos globales asociados a `AppComponent`.
│   │   ├── app.component.spec.ts   # 🧪 Archivo de prueba unitaria para `AppComponent`.
│   │   ├── app.config.ts           # ⚙️ Configuraciones globales del cliente.
│   │   └── app.config.server.ts    # 🛠️ Configs específicas para SSR o entornos backend
│
│   ├── assets/                     # 🖼️ Imágenes, íconos, tipografías.
│   ├── environments/               # 🌎 Variables por entorno (dev, prod).
│   └── index.html                  # 🚪 Punto de entrada HTML.
│
├── angular.json                    # ⚙️ Config del proyecto Angular.
├── package.json                    # 📦 Dependencias, scripts, build info.
└── README.md                       # 📘 Documentación básica del proyecto.
```

## &nbsp;

© Almuerza Perú – 2025
