module.exports = {
  "**/*.ts": ["biome format", "biome lint"],
  "**/*.html": ["biome format", "biome lint"],
  "**/*.scss": ["biome format"],
  "**/*.{js,jsx,ts,tsx}": ["biome lint", "biome format"],
  "**/*.{json,md}": ["biome format"]
};