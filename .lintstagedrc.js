module.exports = {
  "**/*.ts": ["biome format --write", "biome lint"],
  "**/*.{js,jsx,tsx}": (files) =>
    files.filter((f) => !f.includes(".lintstagedrc.js")).map((f) => `biome lint ${f}`),
  "**/*.{json,md}": ["biome format --write"]
};