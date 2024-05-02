const path = require("path");
const rspack = require("@rspack/core");

const PUBLIC_URL =
  process.env.NODE_ENV === "production" ? "/financial-time-series-labeler" : "";

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
  target: "browserslist",
  entry: "./src/index.tsx",
  output: { clean: true, filename: "[name].[contenthash].js" },
  resolve: {
    extensions: ["...", ".ts", ".tsx"],
    // https://github.com/web-infra-dev/rspack/issues/2312
    tsConfigPath: path.resolve(__dirname, "./tsconfig.json"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: { jsc: { transform: { react: { runtime: "automatic" } } } },
      },
    ],
  },
  stats: "normal",
  plugins: [
    new rspack.CopyRspackPlugin(["public"]),
    new rspack.HtmlRspackPlugin({
      publicPath: PUBLIC_URL,
      template: "./src/index.html",
      templateParameters: { PUBLIC_URL },
    }),
  ],
};
