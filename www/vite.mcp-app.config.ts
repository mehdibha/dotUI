// The MCP App cards. Hosts render a card's HTML in a sandboxed iframe; /mcp
// serves that HTML with absolute URLs to these hashed files, which /mcp-app/*
// serves with CORS, so chunks (icon libraries) load only when used.
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const src = path.resolve(import.meta.dirname, "src")
const app = path.join(src, "modules/mcp/app")

export default defineConfig({
  root: app,
  base: "./",
  define: {
    "import.meta.env.VERCEL_ENV": JSON.stringify(""),
  },
  resolve: {
    alias: [{ find: /^@\//, replacement: `${src}/` }],
  },
  plugins: [tailwindcss(), viteReact()],
  build: {
    outDir: path.join(src, "modules/mcp/__generated__"),
    emptyOutDir: true,
    assetsDir: "",
    rollupOptions: { input: path.join(app, "directions.html") },
  },
})
