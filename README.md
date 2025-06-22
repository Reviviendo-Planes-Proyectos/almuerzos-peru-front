# Almuerza Perú - Proyecto Web

**Almuerza Perú** es una **Progressive Web App (PWA)** diseñada para revolucionar la forma en que los restaurantes locales muestran sus menús diarios, brindando visibilidad en línea a pequeños restaurantes y mejorando la experiencia de los comensales al permitirles encontrar rápidamente opciones de menú cerca de su ubicación.

## Tipo de Aplicación

La aplicación **Almuerza Perú** será una **PWA (Progressive Web App)**, lo que significa que:
- Los usuarios podrán **instalarla** en sus dispositivos como una aplicación nativa.
- Funciona de manera **offline**, utilizando **service workers** para almacenar en caché los recursos y permitir el acceso sin conexión.
- Se optimiza para ofrecer una experiencia similar a una aplicación móvil, pero con la flexibilidad y accesibilidad de una página web.

## Patrón de Arquitectura

La **arquitectura** del proyecto se basa en dos patrones principales:

### **Clean Architecture**

Este patrón se enfoca en la **separación de responsabilidades** en diferentes capas, de modo que la lógica de negocio esté completamente **desacoplada** de los detalles de la interfaz de usuario y las interacciones con el sistema (bases de datos, APIs, etc.). Las principales capas en Clean Architecture son:

- **Capa de Entidades (Modelo)**: Representa los datos y las reglas de negocio fundamentales de la aplicación.
- **Capa de Casos de Uso (Lógica de aplicación)**: Define la lógica de cómo interactúan las entidades y los servicios.
- **Capa de Interfaces**: Es la capa que maneja la interacción con el usuario (UI), así como las interfaces con otras tecnologías como bases de datos y APIs.

La **Clean Architecture** asegura que el sistema sea **escalable**, **mantenible** y **fácil de probar** a medida que evoluciona.

### **Component-Based Architecture**

La interfaz de usuario se desarrolla utilizando una **arquitectura basada en componentes**, que es ideal para aplicaciones modernas como PWAs. En esta arquitectura:

- La aplicación se divide en **componentes reutilizables**, cada uno con su propia lógica y presentación.
- Esto permite una **gran flexibilidad** y facilita el mantenimiento, ya que los componentes se pueden actualizar y probar de manera independiente.

### **Modularización y Lazy Loading**

- Cada funcionalidad principal (como la autenticación, gestión de restaurantes, menús, etc.) está organizada en **módulos** independientes. Esto permite cargar solo las partes necesarias de la aplicación, mejorando el rendimiento y la escalabilidad.


## Tecnologías a Utilizar

Para desarrollar **Almuerza Perú**, se utilizarán las siguientes **tecnologías**:

### **Frontend:**
- **Angular 18.2.2**: Framework principal para la aplicación. Angular permite una estructura robusta, escalable y optimizada para aplicaciones de una sola página (SPA) y PWAs.
- **PWA**: Implementación de Progressive Web App para ofrecer una experiencia de usuario **offline**, utilizando **service workers** para el almacenamiento en caché y **notificaciones push**.
- **Angular Material**: Biblioteca de componentes que sigue las pautas de **Material Design** para Angular, asegurando una experiencia de usuario moderna, consistente y accesible.
- **Tailwind CSS**: Utilidades de diseño personalizadas para una apariencia moderna y flexible, permitiendo una mayor personalización del diseño sin escribir CSS complejo.
- **NGPrime**: Componentes avanzados para tablas, gráficos, calendarios y más, proporcionando elementos UI listos para usar y optimizados para interfaces ricas y dinámicas.

## Backend:

- **NestJS**: Framework basado en **Node.js** y **TypeScript** para construir aplicaciones escalables y robustas. NestJS se utiliza para gestionar la lógica del backend, creando una API basada en **GraphQL** para manejar las consultas y mutaciones de los restaurantes, menús y usuarios.

- **GraphQL**: Implementación de **GraphQL** para la gestión flexible y eficiente de consultas de datos, permitiendo a los clientes solicitar solo la información que necesitan. Esto mejora el rendimiento y reduce el número de solicitudes al servidor.

- **JWT (JSON Web Tokens)**: Para manejar la **autenticación** y **autorización** de los usuarios, permitiendo el acceso seguro a las funcionalidades del sistema. Los tokens JWT son utilizados para garantizar que solo los usuarios autenticados puedan realizar operaciones protegidas.

- **PostgreSQL**: Base de datos relacional utilizada para almacenar los datos de los restaurantes, menús y usuarios. **PostgreSQL** es ideal para manejar relaciones entre entidades, lo que permite garantizar la integridad y consistencia de los datos en el sistema.

- **Google Maps API**: Para la **geolocalización** de los restaurantes y la **búsqueda basada en ubicación**, permitiendo que los usuarios encuentren rápidamente restaurantes cercanos a su ubicación.

- **TypeORM** o **Prisma** (opcional): Para interactuar con la base de datos de manera eficiente y estructurada, utilizando un ORM que facilite las operaciones de bases de datos en **PostgreSQL**.

### **Herramientas para Desarrollo:**
- **Jest** o **Karma**: Para las pruebas unitarias de los componentes de Angular.
- **Protractor**: Para realizar las pruebas **end-to-end (e2e)**, verificando que la aplicación funcione correctamente en un entorno real.

### **Gestión de Dependencias:**
- **npm**: Para la gestión de paquetes y dependencias del proyecto.

## Instalación y Ejecución

Para comenzar con el desarrollo de **Almuerza Perú**, sigue estos pasos:

**Clonar el repositorio**:
```bash
   git clone https://github.com/Reviviendo-Planes-Proyectos/almuerzos-peru-front.git
   cd almuerzos-peru-front
```

La aplicación estará disponible en http://localhost:4200/.


### **Estructura del Proyecto**
La estructura del proyecto se organiza de manera que permita una escalabilidad fácil, con una distinción clara entre componentes, servicios y módulos.

```bash
almuerza-peru/
│
├── e2e/
│   └── src/
│       ├── app.e2e-spec.ts         # ✅ Casos de prueba E2E que simulan flujos reales del usuario.
│       ├── app.po.ts               # ✅ Page Object para encapsular interacción con UI durante pruebas.
│       ├── app.component.e2e.ts    # ✅ Validaciones E2E específicas del componente principal.
│       └── test-setup.ts           # ✅ Config inicial para ejecutar pruebas de extremo a extremo.
│
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