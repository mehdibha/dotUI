import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import {
  remarkInstall,
  type RemarkInstallOptions,
} from "@/lib/mdx-plugins/remark-install";
import remarkInlineCode from "@/lib/mdx-plugins/remark-inline-code";

export const { docs, meta } = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
          })
        )
        .optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [
        remarkInstall,
        {
          Tabs: "InstallTabs",
          Tab: "InstallTab",
        } satisfies RemarkInstallOptions,
      ],
      [remarkInlineCode]
    ],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed",
      },
      inline: "tailing-curly-colon",
      defaultLanguage: "ts",
      
    },
  },
});
