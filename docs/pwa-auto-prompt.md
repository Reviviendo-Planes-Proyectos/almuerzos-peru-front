# PWA Prompt Automático - Guía de Implementación

## Resumen

El componente `PwaPromptComponent` muestra automáticamente el prompt de instalación de PWA cuando la app es instalable, mejorando la experiencia del usuario y maximizando la tasa de instalación.

&nbsp;

## Características Implementadas

### 1. Prompt Automático Inteligente

- **Detección automática**: El componente detecta si la app es instalable.
- **Aparición automática**: Se muestra tras 3 segundos cuando el evento `beforeinstallprompt` está disponible.
- **Timeout inteligente**: Si no está disponible tras 30 segundos, deja de intentar.

### 2. Respeto a las Preferencias del Usuario

- **Control de frecuencia**: Si el usuario rechaza el prompt, no se muestra de nuevo por 24 horas.
- **Almacenamiento local**: Usa `localStorage` para recordar preferencias.
- **SSR compatible**: Solo funciona en navegador.

### 3. Múltiples Formas de Activación

- **Automático**: Aparece automáticamente cuando es posible.
- **FAB manual**: Botón flotante siempre disponible si es instalable.
- **Método programático**: `showPromptManually()` para disparar desde otros componentes.

### 4. UI Moderna y Premium

- **Gradiente animado**: Naranja vibrante, glassmorphism, animaciones bouncy.
- **Iconos animados**: Pulso, halo, shimmer, efectos premium.
- **Botones premium**: Gradientes, glassmorphism, efectos hover.
- **Animaciones fluidas**: Transform 3D, cubic-bezier, responsive total.

&nbsp;

## Configuración del Comportamiento

### Tiempos de Activación

```typescript
// Espera antes de mostrar el prompt automático
setTimeout(() => {
  this.showInstallPrompt = true;
}, 3000); // 3 segundos

// Timeout para dejar de verificar disponibilidad
setTimeout(() => {
  clearInterval(checkInterval);
}, 30000); // 30 segundos
```

### Control de Frecuencia

```typescript
// Tiempo antes de mostrar nuevamente tras rechazar
const hoursSinceDismissed = timeDiff / (1000 * 60 * 60);
return hoursSinceDismissed < 24; // 24 horas
```

&nbsp;

## Uso en la Aplicación

### Integración

- `app.component.html` (global)
- `landing.component.html` (inicio)

### Métodos Públicos Disponibles

```typescript
// Mostrar prompt manualmente
showPromptManually(): void
// Verificar si se puede instalar
get isInstallable(): boolean
// Instalar la aplicación
async installApp(): Promise<void>
// Actualizar la aplicación
async updateApp(): Promise<void>
```

&nbsp;

## Personalización del Diseño

### Colores y Gradientes

```css
background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
color: white; /* Títulos */
color: rgba(255, 255, 255, 0.9); /* Subtítulos */
```

### Efectos Visuales y Animaciones

- Gradiente animado, glassmorphism, shimmer, pulse, float, cubic-bezier.
- Botones y FAB con efectos hover y transiciones suaves.

### Personalización

Para cambiar colores, tiempos o mensajes, modifica las variables y templates en el componente.

&nbsp;

## Requisitos del Navegador

- **Chrome/Edge**: Soporte completo para `beforeinstallprompt`.
- **Firefox**: Soporte limitado (no prompt automático).
- **Safari**: Instalación manual desde menú compartir.
- **PWA configurada**: Requiere manifest.json y service worker válidos.

&nbsp;

## Debugging y Testing

1. Servir la app: `npm start`
2. Abrir en Chrome/Edge
3. DevTools > Application > Manifest
4. Verificar manifest válido
5. El prompt debe aparecer automáticamente tras unos segundos

Para forzar el prompt en producción:

1. `npm run build`
2. Servir desde HTTPS
3. Abrir en navegador compatible

&nbsp;

## Mejores Prácticas

1. No ser intrusivo: el prompt respeta preferencias
2. Ofrecer alternativas: FAB siempre disponible
3. Mensaje claro: explica beneficios de instalar
4. Responsive y accesible
5. Usa Material Design para accesibilidad

&nbsp;

---

© 2025 Almuerzos Perú
