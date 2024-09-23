/* eslint-env node */
module.exports = {
  extends: "eslint:recommended",
  plugins: ["astro", "jsx-a11y", "@typescript-eslint", "prettier"],
  ignorePatterns: ["package.json", "package-lock.json"],
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        "no-console": "error",
        "no-debugger": "error",
      },
    },
  ],
};
