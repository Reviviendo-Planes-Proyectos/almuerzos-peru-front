# 🌐 Guía de Traducciones - Almuerzos Perú

**Cómo agregar y usar traducciones en el proyecto**

## 🚀 Uso Rápido

### **En HTML (Más común)**

```html
<!-- Texto simple -->
<h1>{{ 'auth.login.title' | t }}</h1>
<button>{{ 'common.save' | t }}</button>

<!-- Con directiva (automático) -->
<h1 appTranslate="auth.login.title"></h1>
<button appTranslate="common.save"></button>
```

### **En TypeScript**

```typescript
import { BaseTranslatableComponent } from '../shared/i18n';

// ✅ Opción 1: Extender clase base (RECOMENDADO)
export class MyComponent extends BaseTranslatableComponent {
  showMessage() {
    alert(this.t('messages.success'));
  }
}

// ✅ Opción 2: Inyección manual (solo si no puedes extender)
export class MyComponent {
  private i18n = inject(I18nService);

  showMessage() {
    alert(this.i18n.t('messages.success'));
  }
}
```

&nbsp;

## 📝 Agregar Nuevas Traducciones

### **1. Editar archivos de idioma:**

- **Español:** `messages/es.json`
- **Inglés:** `messages/en.json`

```json
{
  "auth": {
    "login": {
      "title": "Iniciar Sesión",
      "button": "Entrar"
    }
  },
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

### **2. Usar en tu código:**

```html
<h1>{{ 'auth.login.title' | t }}</h1>
<button>{{ 'common.save' | t }}</button>
```

&nbsp;

## 📖 Ejemplos Simples

### **Formulario de Login**

```typescript
@Component({
  imports: [TranslatePipe], // 👈 Importante
  template: `
    <h1>{{ t('auth.login.title') }}</h1>
    <input [placeholder]="t('auth.login.email')" />
    <button>{{ t('auth.login.button') }}</button>
  `
})
export class LoginComponent extends BaseTranslatableComponent {}
```

### **Con Directiva (más eficiente)**

```typescript
@Component({
  imports: [TranslateDirective], // 👈 Importante
  template: `
    <h1 appTranslate="auth.login.title"></h1>
    <button appTranslate="auth.login.button"></button>
  `
})
export class LoginComponent extends BaseTranslatableComponent {}
```

### **Cambiar Idioma**

```typescript
export class LanguageComponent extends BaseTranslatableComponent {
  switchToEnglish() {
    this.i18n.setLanguage('en');
  }

  switchToSpanish() {
    this.i18n.setLanguage('es');
  }
}
```

&nbsp;

## ❗ Problemas Comunes

### **No aparecen las traducciones**

```typescript
// ❌ Falta import o extensión
@Component({
  template: `
    {{ t('key') }}
  ` // No funciona
})
export class MyComponent {}

// ✅ Con herencia
@Component({
  imports: [TranslatePipe], // 👈 Necesario
  template: `
    {{ t('key') }}
  ` // Funciona
})
export class MyComponent extends BaseTranslatableComponent {}
```

### **Clave no encontrada**

- Verifica que existe en `messages/es.json` y `messages/en.json`
- Usa nombres con puntos: `'auth.login.title'`

### **Import incorrecto**

```typescript
// ❌ Mal
import { I18nService } from '../core/translations';

// ✅ Bien
import { BaseTranslatableComponent } from '../shared/i18n';
```

&nbsp;

## 🎯 Reglas Simples

1. **Nombres de claves:** Usa puntos para organizar
   - `'auth.login.title'` ✅
   - `'loginTitle'` ❌

2. **Componentes:** Extiende `BaseTranslatableComponent` y usa `t()`

3. **Templates:** Importa `TranslatePipe` o `TranslateDirective`

4. **Archivos:** Actualiza `es.json` y `en.json` siempre

&nbsp;

---

© 2025 Almuerzos Perú
