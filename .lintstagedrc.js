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
  '**/*.json': ['biome format --write'],
  '**/*.md': ['prettier --write'],
  '**/*.{html,scss}': (files) => files.map((f) => `prettier --write ${f}`),
};
