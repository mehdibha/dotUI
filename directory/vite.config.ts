import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

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
    nitro({ preset: process.env.VERCEL ? "vercel" : "node" }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
})
