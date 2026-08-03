import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import lastModified from 'fumadocs-mdx/plugins/last-modified'
import { z } from 'zod'

import rehypeHighlight from './src/modules/docs/mdx-plugins/rehype-highlight'
import rehypeTransform from './src/modules/docs/mdx-plugins/rehype-transform'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true, // Load files asynchronously to avoid bundling all at once
    schema: pageSchema.extend({
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
          }),
        )
        .optional(),
      wip: z.boolean().optional().default(false),
      // Wide layout: the content column expands and the xl TOC rail is dropped.
      full: z.boolean().optional().default(false),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
})

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    // Code highlighting is @tanstack/highlight via rehypeHighlight below.
    rehypeCodeOptions: false,
    rehypePlugins: [rehypeHighlight, rehypeTransform],
  },
})
