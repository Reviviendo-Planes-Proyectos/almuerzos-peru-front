module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'], // Buscar archivos .spec.ts
  collectCoverage: false,  // No recoger cobertura por defecto
  coverageReporters: ['html', 'lcov', 'text', 'text-summary', 'json'],
  coverageDirectory: '<rootDir>/coverage', // Directorio de cobertura
  verbose: false, // No verbose por defecto
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/main.server.ts',
    '!src/setup-jest.ts',
    '!src/environments/**',
    '!src/polyfills.ts',
    '!**/*.module.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 85,
      statements: 85
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1'
  },
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@angular|@ngrx|ngx-.*|ng-.*|@ionic))'
  ],
  testEnvironment: 'jsdom'
};
