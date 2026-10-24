import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import fs from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import type { Plugin } from "vite"

// In dev, /refs/<slug>/<path> serves the frozen copies and crops a capture
// left in www/.scratch-refs/<slug>/. Only files in a crops/ folder: the
// private page shots and raw bundles beside them stay unserved.
const refsDir = path.resolve(import.meta.dirname, "../www/.scratch-refs")
function refs(): Plugin {
  return {
    name: "directory-refs",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/refs", (req, res, next) => {
        const rel = decodeURIComponent((req.url ?? "").split("?")[0] ?? "")
        const file = path.join(refsDir, rel)
        const inside = file.startsWith(`${refsDir}${path.sep}`)
        if (!inside || !rel.split("/").includes("crops")) return next()
        if (!/\.(json|png)$/.test(file) || !fs.existsSync(file)) return next()
        res.setHeader(
          "Content-Type",
          file.endsWith(".png") ? "image/png" : "application/json",
        )
        fs.createReadStream(file).pipe(res)
      })
    },
  }
}

// No page links to a captured system yet: seed the prerender with each one.
const systemsDir = path.resolve(import.meta.dirname, "systems")
const captured = fs
  .readdirSync(systemsDir)
  .filter((slug) => fs.existsSync(path.join(systemsDir, slug, "looks.json")))

// `~/` is this app, `@/` is www's source: registry components and the preset
// engine come straight from there, as in video/.
export default defineConfig({
  server: {
    port: 4445,
  },
  resolve: {
    alias: [
      {
        find: /^~\//,
        replacement: `${path.resolve(import.meta.dirname, "src")}/`,
      },
      {
        find: /^@\//,
        replacement: `${path.resolve(import.meta.dirname, "../www/src")}/`,
      },
    ],
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    refs(),
    nitro({ preset: process.env.VERCEL ? "vercel" : "node" }),
    tailwindcss(),
    tanstackStart({
      pages: captured.map((slug) => ({ path: `/systems/${slug}` })),
      prerender: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
})
