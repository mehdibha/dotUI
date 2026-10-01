import path from "node:path"
import type { WebpackOverrideFn } from "@remotion/bundler"

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
   builds, so components render exactly as they do in /studio.

   A factory, not a module-level value: the Remotion CLI loads the config as
   CJS (no import.meta), scripts load it as ESM. Each passes its own root and
   resolver. */
export function makeWebpackOverride({
  root,
  resolve,
}: {
  /** The video/ package directory. */
  root: string
  resolve: (id: string) => string
}): WebpackOverrideFn {
  return (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": path.join(root, "../www/src"),
        "starter-themes": path.join(root, "src/shims/starter-themes.ts"),
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
            resolve("style-loader"),
            resolve("css-loader"),
            resolve("@tailwindcss/webpack"),
          ],
        },
      ],
    },
  })
}
