import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const PUBLIC_URL =
  process.env.NODE_ENV === "production" ? "/financial-time-series-labeler" : "";

export default defineConfig({
  html: {
    template: "./src/index.html",
    templateParameters: { PUBLIC_URL },
  },
  output: { assetPrefix: PUBLIC_URL },
  plugins: [pluginReact()],
});
