const CopyPlugin = require("copy-webpack-plugin");

/*
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  entry: { main: "./src/index.tsx" },
  resolve: { tsConfigPath: "./tsconfig.json" },
  builtins: { html: [{ template: "./public/index.html" }] },
  plugins: [new CopyPlugin([{ from: "public", to: "." }])],
};
