# 📦 Guía de Módulos Compartidos

Esta guía explica cómo usar los diferentes módulos disponibles en la aplicación.

## 📁 Estructura de Módulos

```
src/app/shared/modules/
├── index.ts                    # Barrel exports
├── core.module.ts             # Angular Core (CommonModule + ReactiveFormsModule)
├── material.module.ts         # Angular Material components
├── shared-components.module.ts # Custom shared components
└── shared.module.ts           # Combina todos los módulos
```

## 🎯 Casos de Uso

### 1. Para componentes que necesitan TODO

```typescript
import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/modules';

@Component({
  selector: 'app-full-component',
  standalone: true,
  imports: [SharedModule],
  template: `
    <!-- Tienes acceso a: -->
    <!-- - CommonModule (*ngIf, *ngFor, etc.) -->
    <!-- - ReactiveFormsModule (FormBuilder, etc.) -->
    <!-- - Material Design (mat-button, mat-card, etc.) -->
    <!-- - Custom components (app-button, app-input-field, etc.) -->
  `
})
export class FullComponent {}
```

### 2. Para componentes que solo usan Angular Material

```typescript
import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/modules';

@Component({
  selector: 'app-material-component',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <mat-card>
      <mat-button>Click me</mat-button>
    </mat-card>
  `
})
export class MaterialComponent {}
```

### 3. Para componentes que solo usan Angular Core

```typescript
import { Component } from '@angular/core';
import { CoreModule } from '../../../shared/modules';

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [CoreModule],
  template: `
    <form [formGroup]="myForm">
      <div *ngIf="showField">
        <input formControlName="name" />
      </div>
    </form>
  `
})
export class FormComponent {}
```

### 4. Para componentes que solo usan custom components

```typescript
import { Component } from '@angular/core';
import { SharedComponentsModule } from '../../../shared/modules';

@Component({
  selector: 'app-custom-component',
  standalone: true,
  imports: [SharedComponentsModule],
  template: `
    <app-button>Custom Button</app-button>
    <app-input-field label="Name"></app-input-field>
  `
})
export class CustomComponent {}
```

### 5. Para máxima granularidad

```typescript
import { Component } from '@angular/core';
import { MaterialModule, CoreModule } from '../../../shared/modules';

@Component({
  selector: 'app-granular-component',
  standalone: true,
  imports: [MaterialModule, CoreModule],
  template: `
    <!-- Solo Material + Core, sin custom components -->
  `
})
export class GranularComponent {}
```

## ✅ Ventajas de esta Estructura

1. **Tree-shaking optimizado** - Solo importas lo que necesitas
2. **Separación clara** - Cada módulo tiene una responsabilidad específica
3. **Flexibilidad** - Puedes combinar módulos según tus necesidades
4. **Mantenibilidad** - Fácil de actualizar y modificar
5. **Escalabilidad** - Fácil agregar nuevos módulos

## 📊 Comparación de Tamaños

| Módulo                   | Incluye                            | Tamaño estimado |
| ------------------------ | ---------------------------------- | --------------- |
| `CoreModule`             | CommonModule + ReactiveFormsModule | ~50KB           |
| `MaterialModule`         | Solo componentes Material          | ~200KB          |
| `SharedComponentsModule` | Solo custom components             | ~30KB           |
| `SharedModule`           | Todos los anteriores               | ~280KB          |

## 🚀 Recomendaciones

- Usa `SharedModule` para componentes de páginas principales
- Usa módulos específicos para componentes pequeños o optimizados
- Siempre importa desde `../shared/modules` para consistencia

## 🔗 Enlaces Relacionados

- [Arquitectura del Proyecto](./architecture.md)
- [Estructura del Proyecto](./project-structure.md)
- [Tecnologías Utilizadas](./technologies-used.md)
