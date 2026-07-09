import path from 'node:path'
import { configDefaults, defineConfig } from 'vitest/config'

// Two projects: ds/ tests run under ds's own config (its `@/` → ds/src), the
// rest of the workspace under the www alias.
export default defineConfig({
  test: {
    projects: [
      'ds/vitest.config.ts',
      {
        resolve: {
          alias: [
            {
              find: /^@\/\.source\//,
              replacement: `${path.resolve(import.meta.dirname, 'www/.source')}/`,
            },
            {
              find: /^@\//,
              replacement: `${path.resolve(import.meta.dirname, 'www/src')}/`,
            },
          ],
        },
        test: {
          name: 'www',
          exclude: [
            ...configDefaults.exclude,
            '**/node_modules/**',
            '**/fixtures/**',
            '**/templates/**',
            '**/.claude/worktrees/**',
            'ds/**',
          ],
        },
      },
    ],
  },
})
