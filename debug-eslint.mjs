import { ESLint } from 'eslint';

const eslint = new ESLint({
  overrideConfigFile: './eslint.config.js',
});

const results = await eslint.calculateConfigForFile('src/main.ts');
console.log(JSON.stringify(results, null, 2));
