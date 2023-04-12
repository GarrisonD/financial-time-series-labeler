const path = require("path");

// https://github.com/web-infra-dev/rspack/issues/2616
const PUBLIC_URL = ["build", "production"].includes(process.env.NODE_ENV)
  ? "/financial-time-series-labeler"
  : "";

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
  target: "web", // https://github.com/web-infra-dev/rspack/issues/2735
  entry: "./src/index.tsx",
  output: { clean: true, filename: "[name].[contenthash].js" },
  resolve: {
    // https://github.com/web-infra-dev/rspack/issues/2312
    tsConfigPath: path.resolve(__dirname, "./tsconfig.json"),
  },
  builtins: {
    copy: { patterns: ["public"] },
    html: [
      {
        publicPath: PUBLIC_URL,
        template: "./src/index.html",
        templateParameters: { PUBLIC_URL },
      },
    ],
  },
  stats: "normal",
};
