import { defineCollection, defineConfig } from "@content-collections/core";
import { createMetaSchema, createDocSchema, transformMDX } from "@fumadocs/content-collections/configuration";
const docs = defineCollection({
  name: "docs",
  directory: "content",
  include: "**/*.mdx",
  schema: (z) => ({
    ...createDocSchema(z),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        })
      )
      .optional(),
  }),
  transform: transformMDX,
});

const metas = defineCollection({
  name: "metas",
  directory: "content",
  include: "**/*.json",
  schema: createMetaSchema,
});

export default defineConfig({
  collections: [docs, metas],
});
