import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import type { Plugin } from "vite"

import { bundleCopies, capturedSlugs, copyPaths } from "./scripts/copies"

// In dev, /copies/<slug>/<date>.json serves a system's frozen copies straight
// from the census in www/.scratch-refs, as the Blob store does once uploaded.
function copies(): Plugin {
  return {
    name: "directory-copies",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/copies", (req, res, next) => {
        const [slug, file] =
          (req.url ?? "").split("?")[0]?.slice(1).split("/") ?? []
        const date = file?.replace(/\.json$/, "")
        if (!slug || !capturedSlugs().includes(slug) || !date) return next()
        const paths = copyPaths(slug).get(date)
        if (!paths) return next()
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(bundleCopies(slug, paths).copies))
      })
    },
  }
}

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
    copies(),
    nitro({ preset: process.env.VERCEL ? "vercel" : "node" }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        // A link to a section renders the same page as its link without it.
        filter: ({ path }) => !path.includes("#"),
      },
    }),
    viteReact(),
  ],
})
