module.exports = {
  '**/*.ts': ['biome format --write', 'biome lint'],

  '**/*.{js,jsx,tsx}': (files) =>
    files
      .filter(
        (f) =>
          !f.includes('.lintstagedrc.js') &&
          !f.includes('.prettierrc.js') &&
          !f.includes('tailwind.config') &&
          !f.includes('vite.config') &&
          !f.includes('jest.config')
      )
      .map((f) => `biome lint ${f}`),

  '**/*.json': (files) =>
    files
      .filter(
        (f) =>
          !f.includes('package-lock.json') &&
          !f.includes('tsconfig') &&
          (f.includes('package.json') ||
            f.includes('angular.json') ||
            f.includes('biome.json'))
      )
      .map((f) => `biome format --write ${f}`),

  '**/*.md': (files) => files.map((f) => `prettier --write ${f}`),
  '**/*.{html,scss}': (files) => files.map((f) => `prettier --write ${f}`),
};
