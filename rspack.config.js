const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");

const PUBLIC_URL =
  process.env.NODE_ENV === "production" ? "/financial-time-series-labeler" : "";

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
  entry: "./src/index.tsx",
  output: { filename: "[name].[contenthash].js" },
  resolve: {
    // https://github.com/web-infra-dev/rspack/issues/2312
    tsConfigPath: path.resolve(__dirname, "./tsconfig.json"),
  },
  builtins: {
    html: [
      {
        publicPath: PUBLIC_URL,
        template: "./public/index.html",
        templateParameters: { PUBLIC_URL },
      },
    ],
  },
  plugins: [new CopyPlugin([{ from: "public", to: "." }])],
};
