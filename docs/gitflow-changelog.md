# 🚦 GitFlow, Branches, Tags, Commits y Changelog

Esta guía describe el flujo de trabajo Git, convenciones de ramas, tags, commits y el manejo del changelog para el proyecto **Almuerza Perú**.

## GitFlow

![gitflow](./assets/gitflow.png)

Se utiliza un flujo de trabajo basado en **GitFlow** para organizar el desarrollo y facilitar la trazabilidad de cambios.

## Tags

![tags](./assets/tags.png)

- **MAJOR**: Cambios incompatibles con versiones anteriores. Reinicia PATCH y MINOR a 0.
- **MINOR**: Nueva funcionalidad compatible. Reinicia PATCH a 0.
- **PATCH**: Correcciones de errores compatibles.

&nbsp;

# 📦 Pull Request

> Este proyecto utiliza un template único para **todos los pull requests**, con el objetivo de estandarizar la colaboración, facilitar la revisión y mantener calidad técnica.

### 🚩 Tipos de cambio (marca el que aplica)

- [ ] ✨ Feature – Nueva funcionalidad
- [ ] 🐛 Bugfix – Corrección de error
- [ ] 🚑 Hotfix – Solución crítica urgente
- [ ] 🧼 Refactor – Mejora sin cambiar comportamiento
- [ ] 📝 Docs – Cambios de documentación
- [ ] 🎨 Style – Formato, estilos, sin cambios de lógica
- [ ] ✅ Test – Agregado o ajuste de pruebas
- [ ] 🔧 Config – Cambios de build, herramientas, etc.

### 🧠 Descripción

_¿Qué se hizo? ¿Qué problema resuelve o qué funcionalidad aporta?_
Agrega capturas, GIFs o pasos si ayuda a entender.

### 📋 Checklist

Marca lo que aplicó en este PR:

- [ ] Cambios probados localmente
- [ ] Se mantuvo la funcionalidad existente
- [ ] Tests agregados o modificados (si aplica)
- [ ] Documentación actualizada (si aplica)
- [ ] Pasa `lint`, `format` y `test`
- [ ] Rama actualizada con `develop`

### 🔍 Notas adicionales

_Comentarios importantes, decisiones técnicas, advertencias o cualquier información relevante para el equipo de revisión._

> 🔒 Esto asegura consistencia, claridad y facilidad para la revisión del equipo.

**Recomendación:** No más de 50 commits por cada pull request.

&nbsp;

## Changelog

El changelog debe mantenerse en el archivo `CHANGELOG.md` en la raíz del proyecto. Cada versión debe documentar los cambios principales siguiendo el estándar [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y [SemVer](https://semver.org/lang/es/).

### Ejemplo de sección de changelog

```markdown
## [1.2.0] - 2025-07-27

### Added

- Nueva funcionalidad de login social
- Soporte para PWA offline

### Changed

- Actualización de dependencias Angular 18.2.13

### Fixed

- Corrección de bug en menú diario
```

&nbsp;

---

© 2025 Almuerzos Perú
