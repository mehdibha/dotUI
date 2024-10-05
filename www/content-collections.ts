import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";

const docs = defineCollection({
  name: "docs",
  directory: "content",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z
      .object({
        image: z.string().optional(),
        video: z.string().optional(),
      })
      .optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        })
      )
      .optional(),
    toc: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          depth: z.number(),
        })
      )
      .optional(),
  }),
  transform: async (doc, ctx) => {
    const content = await compileMDX(ctx, doc, {
      remarkPlugins: [remarkGfm],
    });
    return {
      ...doc,
      content,
      rawContent: doc.content,
    };
  },
});

export default defineConfig({
  collections: [docs],
});
