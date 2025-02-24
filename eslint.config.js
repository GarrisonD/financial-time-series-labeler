import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
// import pluginReactHooks from "eslint-plugin-react-hooks";

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { settings: { react: { version: "detect" } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  pluginJsxA11y.flatConfigs.recommended,
  // https://github.com/facebook/react/issues/32431
  // pluginReactHooks.configs["recommended-latest"]
];
