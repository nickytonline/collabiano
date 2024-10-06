import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import typescript from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";
import astroESLintParser from "astro-eslint-parser";
import typescriptParser from "@typescript-eslint/parser";

/* eslint-env node */
export default [
  js.configs.recommended,
  {
    plugins: {
      astro,
      jsxA11y,
      typescript,
      prettier,
    },
    ignores: ["package.json", "package-lock.json"],
    languageOptions: {
      parser: typescriptParser,
    },
  },
  {
    files: ["*.astro"],
    languageOptions: {
      parser: astroESLintParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      "no-console": "error",
      "no-debugger": "error",
    },
  },
];
