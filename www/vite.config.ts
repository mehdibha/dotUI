import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import mdx from "fumadocs-mdx/vite"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import type { Plugin } from "vite"

// Scoped design-system themes must paint before hydration, but the server has
// no CSSOM to harvest the root token closure from. In server environments,
// swap the root-closure-data placeholder for the closure parsed out of the
// compiled stylesheet — see src/lib/root-closure.ts.
const rootClosureDataId = path.resolve(
  import.meta.dirname,
  "src/lib/root-closure-data.ts",
)
function rootClosure(): Plugin {
  return {
    name: "dotui-root-closure",
    enforce: "pre",
    load(id) {
      if (id.split("?")[0] !== rootClosureDataId) return
      if (this.environment.name === "client") return
      return [
        `import cssText from '../styles.css?inline'`,
        `import { parseRootClosure } from './root-closure'`,
        `export default parseRootClosure(cssText)`,
      ].join("\n")
    },
  }
}

export default defineConfig({
  server: {
    port: 4444,
  },
  // Build-time constant so client code can gate on Vercel previews.
  define: {
    "import.meta.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV ?? ""),
  },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            // Rolldown's default splitting merges react-aria and base-ui
            // modules into coarse shared chunks, so every page downloads
            // collection and overlay code only a few routes use. Regroup them
            // by the set of entries that actually import each module.
            codeSplitting: {
              groups: [
                {
                  name: "react-aria",
                  entriesAware: true,
                  test: /[\\/](react-aria-components|react-aria|react-stately|@react-aria|@react-stately|@react-types|@internationalized)[\\/]/,
                },
                {
                  name: "base-ui",
                  entriesAware: true,
                  test: /[\\/]@base-ui[\\/]/,
                },
              ],
            },
            // entriesAware names chunks after every entry that shares them.
            chunkFileNames: (chunk) =>
              /^(react-aria|base-ui)~/.test(chunk.name)
                ? `assets/${chunk.name.split("~")[0]}-[hash].js`
                : "assets/[name]-[hash].js",
          },
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^@\/\.source\//,
        replacement: `${path.resolve(import.meta.dirname, ".source")}/`,
      },
      {
        find: /^@\//,
        replacement: `${path.resolve(import.meta.dirname, "src")}/`,
      },
    ],
  },
  ssr: {
    noExternal: ["@tabler/icons-react"],
  },
  plugins: [
    rootClosure(),
    mdx(await import("./source.config")),
    nitro({
      preset: process.env.VERCEL ? "vercel" : "node",
      rollupConfig: {
        onwarn(warning, warn) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            warning.message.includes('"use client"')
          ) {
            return
          }
          if (warning.code === "EMPTY_BUNDLE") {
            return
          }
          warn(warning)
        },
      },
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        filter: ({ path }) => !path.includes("?"),
      },
    }),
    viteReact(),
  ],
})
