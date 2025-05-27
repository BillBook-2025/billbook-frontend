import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js, prettier: pluginPrettier },
    extends: ["js/recommended", "plugin:prettier/recommended"],
    rules: {
      "prettier/prettier": "error",
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginReact.configs.flat.recommended,
]);
