# PWA Prompt Automático - Guía de Implementación

## Resumen

El componente `PwaPromptComponent` ahora incluye funcionalidad para mostrar automáticamente el prompt de instalación de PWA cuando se detecta que la aplicación se puede instalar. Esto mejora la experiencia del usuario al hacer más visible la opción de instalar la app.

## Características Implementadas

### 1. Prompt Automático Inteligente

- **Detección automática**: El componente verifica automáticamente si la app se puede instalar
- **Aparición automática**: Se muestra después de 3 segundos una vez que el evento `beforeinstallprompt` está disponible
- **Timeout inteligente**: Si no está disponible después de 30 segundos, deja de intentar

### 2. Respeto a las Preferencias del Usuario

- **Control de frecuencia**: Si el usuario rechaza el prompt, no se muestra nuevamente por 24 horas
- **Almacenamiento local**: Utiliza `localStorage` para recordar las preferencias del usuario
- **Verificación de plataforma**: Solo funciona en navegadores (SSR compatible)

### 3. Múltiples Formas de Activación

- **Automático**: Aparece automáticamente cuando es apropiado
- **FAB manual**: Botón flotante disponible cuando se puede instalar
- **Método programático**: `showPromptManually()` para activar desde otros componentes

### 4. UI Espectacular y Moderna

- **Gradiente animado premium**: Gradiente naranja vibrante en 3D con 5 puntos de color
- **Animación de entrada bouncy**: Efecto de rebote suave con cubic-bezier para entrada natural
- **Efectos glassmorphism avanzados**: Multiple backdrop blur, bordes luminosos y transparencias
- **Iconos mejorados**: Icono de restaurante con animación de pulso y efectos de halo
- **Botones de nivel premium**:
  - Botón principal: Gradiente blanco con efectos de brillo deslizante
  - Botón secundario: Glassmorphism con efectos radiales hover
- **Animaciones fluidas**: Transform 3D, escalado suave y transiciones cubic-bezier
- **Tipografía gradient**: Texto con gradiente de color y sombras múltiples
- **Efectos luminosos**: Shimmer effect en el borde superior
- **FAB flotante**: Animación de flotación continua con efectos hover espectaculares
- **Diseño completamente responsivo**: Adaptado perfectamente para todos los dispositivos

## Configuración del Comportamiento

### Tiempos de Activación

```typescript
// Tiempo de espera antes de mostrar el prompt automático
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
// Tiempo antes de mostrar nuevamente después de rechazar
const hoursSinceDismissed = timeDiff / (1000 * 60 * 60);
return hoursSinceDismissed < 24; // 24 horas
```

## Uso en la Aplicación

### Integración Actual

El componente está integrado en:

- `app.component.html` - Nivel global
- `landing.component.html` - Página de inicio

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

## Personalización del Diseño

### Colores y Gradientes

El prompt utiliza un esquema de colores atractivo basado en naranjas:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);

/* Colores de texto */
color: white; /* Títulos */
color: rgba(255, 255, 255, 0.9); /* Subtítulos */

/* Botón principal */
background: white;
color: #ff6b35;

/* Botón secundario */
border: 2px solid rgba(255, 255, 255, 0.3);
color: rgba(255, 255, 255, 0.9);
```

### Efectos Visuales

- **Gradiente animado**: Se mueve suavemente creando dinamismo
- **Sombras múltiples**: Sombra del tema principal + sombra general
- **Backdrop filter**: Efecto de desenfoque sutil
- **Bordes iluminados**: Borde superior con brillo sutil
- **Transformaciones hover**: Los botones se elevan al hacer hover

### Animaciones Espectaculares

```css
/* Animación de entrada con rebote */
@keyframes slideUpBounce {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  60% {
    transform: translateY(-10px);
    opacity: 0.8;
  }
  80% {
    transform: translateY(5px);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Gradiente fluido en movimiento */
@keyframes gradientFlow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  33% {
    background-position: 100% 0%;
  }
  66% {
    background-position: 0% 100%;
  }
}

/* Pulso del icono */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Efecto shimmer en borde superior */
@keyframes shimmer {
  0%,
  100% {
    opacity: 0.3;
    transform: translateX(-100%);
  }
  50% {
    opacity: 1;
    transform: translateX(100%);
  }
}

/* Flotación del FAB */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
```

## Personalización

### Cambiar Esquema de Colores

Para cambiar los colores del prompt, modifica estas variables en los estilos:

```typescript
// Cambiar gradiente principal
background: linear-gradient(135deg, #tu-color-1, #tu-color-2, #tu-color-1);

// Cambiar color del botón principal
.prompt-actions button[mat-raised-button] {
  background: #tu-color-fondo !important;
  color: #tu-color-texto !important;
}

// Cambiar color del FAB
.install-fab {
  background: linear-gradient(135deg, #tu-color-1, #tu-color-2) !important;
}
```

### Modificar Tiempos

Para cambiar cuándo aparece el prompt automático:

```typescript
// En waitForInstallPrompt()
setTimeout(() => {
  this.showInstallPrompt = true;
}, 5000); // Cambiar a 5 segundos
```

### Modificar Frecuencia

Para cambiar con qué frecuencia se puede mostrar:

```typescript
// En wasPromptRecentlyDismissed()
return hoursSinceDismissed < 48; // Cambiar a 48 horas
```

### Personalizar Mensaje

Modificar el template para cambiar el mensaje:

```html
<h3>¡Tu mensaje personalizado!</h3>
<p>Tu descripción personalizada de beneficios</p>
```

## Requisitos del Navegador

- **Chrome/Edge**: Soporte completo para `beforeinstallprompt`
- **Firefox**: Soporte limitado (no se mostrará el prompt automático)
- **Safari**: Instalación manual desde el menú de compartir
- **PWA configurada**: Requiere manifest.json y service worker válidos

## Debugging

Para debug en desarrollo:

```typescript
// Agregar logs en ngOnInit()
console.log('PWA Service initialized:', this.pwaService.canInstallApp());

// En waitForInstallPrompt()
console.log('Checking for install capability...');
```

## Mejores Prácticas

1. **No ser intrusivo**: El prompt aparece una vez y respeta las preferencias
2. **Ofrecer alternativas**: FAB siempre disponible para usuarios que cambien de opinión
3. **Mensaje claro**: Explica claramente los beneficios de instalar
4. **Responsive**: Funciona bien en todos los tamaños de pantalla
5. **Accesible**: Usa herramientas de Material Design para accesibilidad

## Testing

Para probar en desarrollo:

1. Servir la aplicación: `npm start`
2. Abrir en Chrome/Edge
3. Abrir DevTools > Application > Manifest
4. Verificar que el manifest sea válido
5. El prompt debería aparecer automáticamente después de unos segundos

Para forzar el prompt en producción:

1. Construir la aplicación: `npm run build`
2. Servir desde un servidor HTTPS
3. Abrir en un navegador compatible
