import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}",
  ],
  banner: {
    js: `"use client";`,
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "tailwind-variants",
    "tailwind-merge",
    "clsx",
    "react-aria-components",
    "react-aria",
    "@react-aria/utils",
  ],
  esbuildOptions(options) {
    options.platform = "browser";
    options.jsx = "automatic";
  },
});
