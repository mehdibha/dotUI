import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { pageSchema } from 'fumadocs-core/source/schema'
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { z } from 'zod'

export const docs = defineDocs({
  dir: 'content/chapters',
  docs: {
    async: true,
    schema: pageSchema.extend({
      part: z.number(),
      question: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      langs: ['ts', 'tsx', 'css', 'json', 'bash'],
      defaultLanguage: 'plaintext',
      inline: 'tailing-curly-colon',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
