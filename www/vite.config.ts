import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import mdx from 'fumadocs-mdx/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 4444,
  },
  environments: {
    client: {
      build: {
        rollupOptions: {
          output: {
            // The react-aria / base-ui vendor graph is split into ~100 tiny
            // per-hook chunks that all sit in the shared client graph, so every
            // page modulepreloads the lot — a request storm for no byte benefit.
            // Group them into a few stable chunks (client build only, so the
            // nitro server build is untouched). advancedChunks' minShareCount
            // keeps route-only modules out, avoiding cross-route duplication.
            advancedChunks: {
              groups: [
                {
                  name: 'react-aria',
                  test: /[\\/](react-aria-components|react-aria|react-stately|@react-aria|@react-stately|@react-types|@internationalized)[\\/]/,
                },
                { name: 'base-ui', test: /[\\/]@base-ui[\\/]/ },
              ],
            },
          },
        },
      },
    },
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
  ssr: {
    noExternal: ['@tabler/icons-react'],
  },
  plugins: [
    mdx(await import('./source.config')),
    nitro({
      preset: process.env.VERCEL ? 'vercel' : 'node',
      rollupConfig: {
        onwarn(warning, warn) {
          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
            warning.message.includes('"use client"')
          ) {
            return
          }
          if (warning.code === 'EMPTY_BUNDLE') {
            return
          }
          warn(warning)
        },
      },
    }),
    tailwindcss(),
    devtools(),
    tanstackStart({
      prerender: {
        enabled: true,
        filter: ({ path }) => !path.includes('?'),
      },
    }),
    viteReact(),
  ],
})
