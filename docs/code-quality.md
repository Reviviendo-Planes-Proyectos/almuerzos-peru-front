# 🧹 Calidad de Código y Automatización

Este proyecto utiliza una configuración avanzada de herramientas para asegurar la calidad, consistencia y seguridad del código fuente en cada commit y push. A continuación se detalla cómo se usan y configuran:

&nbsp;

## 🦔 Husky

Husky ejecuta scripts automáticos en los hooks de Git para garantizar calidad, estilo y convenciones en cada commit y push.

- **pre-commit**: Ejecuta formateo, lint, tests unitarios y E2E, y luego `lint-staged` solo en archivos staged.
- **commit-msg**: Ejecuta `commitlint` y una validación personalizada que prohíbe mensajes en español y gerundios comunes. Si el mensaje no está en inglés infinitivo y capitalizado, el commit es rechazado.
- **pre-push**: Valida el nombre de la rama (solo permite ramas `feature/nombre-ejemplo`), y bloquea el push si no cumple el formato.

### Ejemplo real de hooks `.husky/`:

```bash
.husky/
├── pre-commit      # npm run format && npm run lint:fix && npm run test:ci && npm run test:e2e && npx lint-staged
├── commit-msg      # npx --no -- commitlint --edit "$1" + validación de idioma y gerundios
├── pre-push        # Valida nombre de rama: solo permite feature/nombre-ejemplo
```

#### Validación de idioma y estilo en commit-msg

El hook rechaza mensajes en español o con gerundios comunes. Ejemplo de error:

```bash
❌ El mensaje contiene palabras en español o gerundios. Usa inglés en infinitivo y capitalizado.
```

#### Validación de nombre de rama en pre-push

Solo se permite el formato: `feature/nombre-ejemplo`. Si no cumple, el push es bloqueado.

&nbsp;

## 📝 Commitlint

Valida que los mensajes de commit sigan el estándar [Conventional Commits](https://www.conventionalcommits.org/), **con reglas personalizadas** para asegurar claridad, consistencia y profesionalismo en cada commit. Además, el hook personalizado exige inglés en infinitivo y capitalizado.

- **Configuración real en `.commitlintrc.js`:**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],
    'header-max-length': [2, 'always', 200],
    'subject-case': [2, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case', 'lower-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never']
  }
};
```

**Principales reglas personalizadas:**

- El encabezado (header) y el cuerpo (body) no pueden exceder 200 caracteres.
- El subject (descripción corta) debe estar en inglés, en infinitivo, capitalizado y sin punto final.
- El subject acepta varios estilos de capitalización: sentence, start, pascal, upper o lower case.
- El tipo (type) debe estar en minúsculas y no puede estar vacío.
- El subject no puede estar vacío.

**Ejemplos de mensajes válidos:**

- `feat(auth): Add social login`
- `fix(menu): Fix display bug`
- `chore(deps): Update Angular version`

**Ejemplos de mensajes inválidos:**

- `feat(auth): agregar login social` _(en español, rechazado)_
- `fix(menu): fixing display bug.` _(gerundio y punto final, rechazado)_
- `Feat(auth): Add social login` _(type en mayúscula, rechazado)_

Si el mensaje no cumple con estas reglas, el commit será rechazado y se mostrará un error explicativo.

&nbsp;

## 🚦 lint-staged

Ejecuta Biome y Prettier solo en los archivos staged antes de cada commit, asegurando que solo se validen los cambios relevantes y acelerando el proceso.

- Configuración en `package.json`:

```json
"lint-staged": {
  "*.{ts,js,html,scss}": [
    "biome check --apply",
    "prettier --write"
  ]
}
```

&nbsp;

## 🧹 Biome y Prettier

- **Biome**: Linter y formateador para TypeScript, HTML y SCSS. Se ejecuta en cada commit, push y en archivos staged.
- **Prettier**: Formateador adicional para HTML y SCSS, complementa a Biome.

### 🔒 Logs centralizados: solo LoggerService

- **No está permitido** el uso de `console.log`, `console.warn`, etc. en ningún archivo del proyecto excepto en `LoggerService`.
- Biome bloqueará cualquier uso de `console` fuera de `LoggerService`.
- Si necesitas loguear, **siempre** inyecta y usa `LoggerService`:

  ```typescript
  constructor(private logger: LoggerService) {}
  this.logger.warn('Mensaje de advertencia');
  ```

- En `LoggerService`, el uso de `console` está permitido solo con la directiva:
  ```typescript
  // biome-ignore lint/suspicious/noConsole: Logger centralizado permitido
  console[level](message, ...optionalParams);
  ```
- Así se garantiza que todos los logs sean controlados, centralizados y fácilmente desactivables en producción.

&nbsp;

## 🛡️ Flujo de Validación Automática

1. **Al hacer commit**:
   - Se ejecuta formateo, lint, tests unitarios y E2E.
   - Se ejecuta `lint-staged` (Biome + Prettier en archivos staged).
   - Se valida el mensaje de commit con `commitlint` y la regla de idioma.
2. **Al hacer push**:
   - Se valida el nombre de la rama (`feature/nombre-ejemplo`).
   - Si alguna validación falla, el push es bloqueado.

&nbsp;

## 📦 Archivos y configuración relevante

- `.husky/` (carpeta de hooks, scripts personalizados y validaciones)
- `.commitlintrc.json` (reglas de commitlint)
- `package.json` (configuración de lint-staged)
- `biome.json` y `.prettierrc` (reglas de formateo)

> Gracias a esta configuración y validaciones automáticas, el código del proyecto se mantiene limpio, consistente, profesional y en inglés técnico en cada cambio.

&nbsp;

---

© 2025 Almuerzos Perú
