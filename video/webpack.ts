import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { WebpackOverrideFn } from "@remotion/bundler"

const require = createRequire(import.meta.url)
const here = path.dirname(fileURLToPath(import.meta.url))

type Rule = { use?: Array<{ loader?: string; options?: object } | null> }

/* Remotion's esbuild loader reads JSX settings from tsconfig through the
   TypeScript API, which TS 7 no longer exposes — so it falls back to classic
   JSX and www files that never import React break. Pin the automatic runtime. */
function automaticJsx(rule: unknown) {
  const use = (rule as Rule).use
  if (!Array.isArray(use)) return rule
  return {
    ...(rule as object),
    use: use.map((entry) =>
      entry?.loader?.includes("esbuild-loader")
        ? { ...entry, options: { ...entry.options, jsx: "automatic" } }
        : entry,
    ),
  }
}

/* Registry source is imported straight from www (`@/…` → www/src), and CSS
   goes through Tailwind v4's webpack loader — the same registry.css the site
   builds, so components render exactly as they do in /studio. */
export const webpackOverride: WebpackOverrideFn = (config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      "@": path.join(here, "../www/src"),
      "starter-themes": path.join(here, "src/shims/starter-themes.ts"),
    },
  },
  module: {
    ...config.module,
    rules: [
      ...(config.module?.rules ?? [])
        .filter(
          (rule) =>
            rule &&
            rule !== "..." &&
            !String((rule as { test?: unknown }).test ?? "").includes(".css"),
        )
        .map(automaticJsx),
      {
        test: /\.css$/i,
        use: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("@tailwindcss/webpack"),
        ],
      },
    ],
  },
})
