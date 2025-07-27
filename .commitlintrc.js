module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],
    'header-max-length': [2, 'always', 200], // tipo: descripción (máx 200 caracteres de descripción)
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
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']
    ]
  }
};
