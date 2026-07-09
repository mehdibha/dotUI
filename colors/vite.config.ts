import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import mdx from 'fumadocs-mdx/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 4446,
  },
  // culori is only reachable through lazily-loaded MDX chapters; without
  // pre-bundling, vite discovers it mid-load and the re-optimize splits the
  // page across two React copies (null-dispatcher hook crashes).
  optimizeDeps: {
    include: ['culori'],
  },
  resolve: {
    alias: [
      {
        find: /^@\/\.source\//,
        replacement: `${path.resolve(import.meta.dirname, '.source')}/`,
      },
      {
        find: /^@\//,
        replacement: `${path.resolve(import.meta.dirname, 'src')}/`,
      },
    ],
  },
  plugins: [
    mdx(await import('./source.config')),
    nitro({ preset: process.env.VERCEL ? 'vercel' : 'node' }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
})
