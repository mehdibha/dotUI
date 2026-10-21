import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { readFile } from "node:fs/promises"
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

// The MCP App card files (src/modules/mcp/cards.ts serves them in production).
// Vite claims a request by its Sec-Fetch-Dest (script, style) before the
// app's /mcp-app/$file route sees it, so dev serves them here first.
const mcpAppDir = path.resolve(
  import.meta.dirname,
  "src/modules/mcp/__generated__",
)
const MCP_APP_TYPES: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
}
function mcpAppFiles(): Plugin {
  return {
    name: "dotui-mcp-app-files",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/mcp-app", async (req, res, next) => {
        const name = path.basename(new URL(req.url ?? "", "http://x").pathname)
        const type = MCP_APP_TYPES[path.extname(name)]
        if (!type) return next()
        try {
          const body = await readFile(path.join(mcpAppDir, name))
          res.setHeader("Content-Type", type)
          res.setHeader("Access-Control-Allow-Origin", "*")
          res.end(body)
        } catch {
          res.statusCode = 404
          res.end()
        }
      })
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
  // Only the lazy studio chunk imports it: discovered late, it reloads the page.
  optimizeDeps: {
    include: ["react-aria/private/interactions/useFocusVisible"],
  },
  plugins: [
    mcpAppFiles(),
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
        filter: ({ path }) =>
          !path.includes("?") && !path.startsWith("/internal"),
      },
    }),
    viteReact(),
  ],
})
