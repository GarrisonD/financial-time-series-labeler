import pluginJs from "@eslint/js";
import globals from "globals";

import tseslint from "typescript-eslint";

import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

import pluginImport from "eslint-plugin-import-x";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

const importOrderPathGroups = [
  {
    pattern: "{react,react-dom/**}",
    group: "external",
    position: "before",
  },
  {
    pattern: "@mui/**",
    group: "external",
    position: "before",
  },
  {
    pattern: "lodash/**",
    group: "external",
    position: "before",
  },

  {
    pattern: "typescript-eslint",
    group: "external",
    position: "after",
  },
  {
    pattern: "eslint-plugin-react**",
    group: "external",
    position: "after",
  },
  {
    pattern: "eslint-plugin-*",
    group: "external",
    position: "after",
  },

  {
    pattern: "contexts/**",
    group: "internal",
    position: "after",
  },
  {
    pattern: "hooks/**",
    group: "internal",
    position: "after",
  },
  {
    pattern: "utils/**",
    group: "internal",
    position: "after",
  },

  {
    pattern: "type-fest",
    group: "type",
  },
];

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    ignores: ["dist/**", "build/**"],
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  pluginJsxA11y.flatConfigs.recommended,
  pluginImport.flatConfigs.recommended,
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      sourceType: "module",
    },
    settings: {
      react: { version: "detect" },
      "import-x/resolver": { typescript: true },
    },
    rules: {
      "import-x/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "type",
          ],
          "newlines-between": "always",
          pathGroups: importOrderPathGroups,
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
    },
  },
];
