import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // environment: "miniflare",
    globals: true,
    reporters: ["verbose"],
  },
  resolve: {
    alias: {
      "~": "./src",
      "^": "./test",
    },
  },
});
