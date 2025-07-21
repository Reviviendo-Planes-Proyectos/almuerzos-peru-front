# 📱 Tipo de Aplicación

La aplicación **Almuerza Perú** está diseñada como una **PWA (Progressive Web App)**. Esto significa que combina lo mejor de las páginas web y de las aplicaciones móviles para ofrecer una experiencia moderna, ligera y accesible.

<p align="center">
  <img src="./assets/pwa-diagram.png" alt="Progressive Web App" style="max-width: 100%; width: 500px;" />
</p>

## ✅ ¿Qué es una PWA?

Una PWA es una aplicación web avanzada que puede:

- Ser **instalada** como si fuera una app nativa desde el navegador (Android/iOS).
- Funcionar **sin conexión** a internet gracias a los **service workers**.
- Integrarse con el sistema operativo (pantalla completa, icono en el escritorio).
- Cargar rápidamente incluso con conexiones lentas o intermitentes.

## 🚀 Ventajas para Almuerza Perú

- **Accesibilidad sin tienda de apps**: los usuarios pueden usarla desde cualquier navegador.
- **Ligereza**: no ocupa mucho espacio en el dispositivo.
- **Offline-ready**: el menú del día puede consultarse incluso sin conexión.
- **Actualizaciones automáticas**: cada nueva versión se sincroniza al abrir la app.

## 🔧 Tecnologías clave

| Tecnología                | Versión | Descripción                                                        |
| ------------------------- | ------- | ------------------------------------------------------------------ |
| `@angular/service-worker` | 18.2.13 | Paquete oficial Angular para activar funcionalidades de PWA.       |
| `@angular/pwa`            | -       | Esquema Angular CLI para configurar automáticamente una PWA.       |
| `Service Worker`          | -       | Script que cachea archivos y maneja respuestas offline.            |
| `Manifest.json`           | -       | Permite definir el comportamiento como app (nombre, ícono, color). |

## &nbsp;

© Almuerza Perú – 2025
