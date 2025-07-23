module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],
    'header-max-length': [2, 'always', 58], // tipo: descripción (máx 50 caracteres de descripción)
    'subject-case': [
      2,
      'always',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case', 'lower-case']
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',      // nueva funcionalidad
        'fix',       // corrección de errores
        'docs',      // solo documentación
        'style',     // cambios de estilo (formato, espacios)
        'refactor',  // refactorización de código sin cambios de funcionalidad
        'perf',      // mejoras de rendimiento
        'test',      // agregar o corregir pruebas
        'build',     // cambios en el sistema de build o dependencias
        'ci',        // configuración de integración continua
        'chore',     // tareas menores sin impacto en el código o tests
        'revert'     // revertir un commit anterior
      ]
    ]
  }
};
