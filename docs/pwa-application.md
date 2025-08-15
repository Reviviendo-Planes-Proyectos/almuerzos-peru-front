# 📱 Progressive Web App (PWA) - Almuerzos Perú

**Almuerza Perú** es una **Progressive Web App (PWA)** moderna, instalable y optimizada para dispositivos móviles y escritorio. Combina lo mejor de la web y las apps nativas para ofrecer una experiencia premium, rápida y accesible.

<p align="center">
  <img src="./assets/pwa-diagram.png" alt="Progressive Web App" style="max-width: 100%; width: 500px;" />
</p>

&nbsp;

## ✅ ¿Qué es una PWA?

Una PWA es una aplicación web avanzada que puede:

- Ser **instalada** como app nativa desde el navegador (Android/iOS/desktop).
- Funcionar **sin conexión** gracias a los **service workers**.
- Integrarse con el sistema operativo (pantalla completa, icono, splash, etc).
- Cargar rápidamente incluso con conexiones lentas o intermitentes.

&nbsp;

## 🚀 Ventajas para Almuerza Perú

- **Accesibilidad universal**: No requiere tienda de apps, funciona en cualquier navegador moderno.
- **Ligereza**: Ocupa poco espacio y se actualiza automáticamente.
- **Offline-ready**: El menú del día y recursos clave están disponibles sin conexión.
- **Actualizaciones automáticas**: Cada nueva versión se sincroniza al abrir la app.
- **Instalación inteligente**: Prompt automático y FAB para instalar, respetando preferencias del usuario.

&nbsp;

## 🔧 Tecnologías clave

| Tecnología                | Versión | Descripción                                               |
| ------------------------- | ------- | --------------------------------------------------------- |
| `@angular/service-worker` | 18.2.13 | Funcionalidades PWA y cacheo offline.                     |
| `@angular/pwa`            | -       | Esquema Angular CLI para configuración automática.        |
| `Service Worker`          | -       | Script que cachea archivos y maneja respuestas offline.   |
| `Manifest.json`           | -       | Define nombre, ícono, colores y comportamiento de la app. |

&nbsp;

## 🧪 Cómo Probar la PWA

### 📋 Prerequisitos

1. **Construir la aplicación** en modo producción:

```bash
npm run build
```

2. **Servir la aplicación** desde el directorio de build:

```bash
cd dist/almuerzos-peru-front
npx http-server -p 4001
```

3. **Abrir en navegador**: `http://localhost:4001`

### 🎮 Comandos de Debug en Consola

Una vez que la aplicación esté cargada, abre las **Developer Tools (F12)** y ejecuta estos comandos en la **consola**:

#### 📦 **Probar Banner de Recordatorio**

```javascript
window.pwaDebug.forceShowReminder();
```

- **Qué hace**: Muestra el banner de recordatorio "¿Te gusta Almuerzos Perú? ¡Instálala!"
- **Qué esperar**: Snackbar naranja/rojo en la parte inferior con gradiente y botón "Instalar"

#### 🔄 **Probar Notificación de Actualización**

```javascript
window.pwaDebug.forceShowUpdate();
```

- **Qué hace**: Simula que hay una nueva versión disponible
- **Qué esperar**: Snackbar verde en la parte inferior con "Nueva versión disponible. ¿Actualizar ahora?"

#### 📲 **Probar Prompt de Instalación**

```javascript
window.pwaDebug.forceShowInstallPrompt();
```

- **Qué hace**: Fuerza mostrar el modal de instalación
- **Qué esperar**: Modal centrado con botón "Instalar App" y opción de cerrar

#### 📊 **Ver Estado de la PWA**

```javascript
window.pwaDebug.getAppStatus();
```

- **Qué hace**: Muestra información del estado actual de instalación
- **Qué esperar**: Objeto con `isInstalled`, `canInstall`, `updateAvailable`

### 🕐 Timing Natural de la PWA

Si no usas los comandos de debug, la PWA tiene estos tiempos naturales:

| Evento                     | Tiempo      | Condición                              |
| -------------------------- | ----------- | -------------------------------------- |
| **FAB de Instalación**     | 15 segundos | Primera visita, app no instalada       |
| **Modal de Instalación**   | 20 segundos | Si el usuario no interactuó con el FAB |
| **Banner de Recordatorio** | 8 segundos  | Segunda visita o más, app no instalada |

### 🔍 Verificar Funcionalidad

#### ✅ **Banner de Recordatorio**

1. Ejecutar: `window.pwaDebug.forceShowReminder()`
2. **Verificar**:
   - Snackbar aparece en la parte inferior
   - Estilo naranja/rojo con gradiente
   - Botón "Instalar" funcional
   - Se cierra automáticamente después de 10 segundos
   - Texto: "¿Te gusta Almuerzos Perú? ¡Instálala!"

#### ✅ **Notificación de Actualización**

1. Ejecutar: `window.pwaDebug.forceShowUpdate()`
2. **Verificar**:
   - Snackbar aparece en la parte inferior
   - Color verde con texto blanco
   - Botón "Actualizar" funcional
   - Mensaje: "Nueva versión disponible. ¿Actualizar ahora?"
   - Al hacer clic: Log en consola "App updated successfully"
   - No se cierra automáticamente (requiere acción del usuario)

#### ✅ **Estado de la PWA**

1. Ejecutar: `window.pwaDebug.getAppStatus()`
2. **Verificar respuesta**:

```javascript
{
  isInstalled: Observable<boolean>,
  canInstall: boolean,
  updateAvailable: Observable<boolean>
}
```

### 📱 Probar en Dispositivos Reales

#### **Android**

1. Abrir Chrome
2. Ir a `http://[tu-ip]:4001`
3. Después de 15-20 segundos: aparece prompt de instalación automático
4. O usar "Añadir a pantalla de inicio" en el menú de Chrome

#### **iOS (Safari)**

1. Abrir Safari
2. Ir a `http://[tu-ip]:4001`
3. Tocar botón "Compartir" → "Añadir a pantalla de inicio"
4. La app muestra banner de instrucciones de instalación manual

#### **Desktop**

1. Chrome/Edge: Icono de instalación en la barra de direcciones
2. Firefox: Funciona como aplicación web normal

### 🐛 Solución de Problemas

#### **Error: `window.pwaDebug` is undefined**

**Causas posibles**:

- Aplicación en modo producción (sin `isDevMode()`)
- Página no terminó de cargar
- Service Worker no se registró

**Soluciones**:

1. Recargar la página y esperar 2-3 segundos
2. Verificar que la app esté en desarrollo: `ng serve` o build local
3. Verificar en consola: `🐛 PWA Debug methods exposed: window.pwaDebug`

#### **Service Worker no funciona**

**Verificar**:

1. Application → Service Workers en DevTools
2. Debe aparecer `ngsw-worker.js` activo
3. En producción solamente (no en `ng serve`)

#### **PWA no se puede instalar**

**Verificar**:

1. Servida por HTTPS o localhost
2. Manifest válido (`/manifest.webmanifest`)
3. Service Worker registrado
4. Iconos de manifest disponibles

### 📈 Métricas de Rendimiento

**Lighthouse PWA Score**: Objetivo 90+

- ✅ Instalable
- ✅ Respuesta rápida
- ✅ Funciona offline
- ✅ Apple Touch Icons
- ✅ Viewport optimizado

&nbsp;

---

## 🎯 Guía Rápida para Desarrolladores

```bash
# 1. Build de producción
npm run build

# 2. Servir aplicación
cd dist/almuerzos-peru-front && npx http-server -p 4001

# 3. Abrir navegador
http://localhost:4001

# 4. Probar en consola del navegador
window.pwaDebug.forceShowUpdate();     # Notificación de actualización
window.pwaDebug.forceShowReminder();   # Banner de recordatorio
window.pwaDebug.getAppStatus();        # Estado actual
```

&nbsp;

---

© 2025 Almuerzos Perú
