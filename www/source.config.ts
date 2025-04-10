import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import { fileGenerator } from "@/lib/mdx-plugins/file-generator";
import {
  remarkDocGen,
  RemarkDocGenOptions,
} from "@/lib/mdx-plugins/remark-docgen";
import remarkInlineCode from "@/lib/mdx-plugins/remark-inline-code";
import {
  remarkInstall,
  type RemarkInstallOptions,
} from "@/lib/mdx-plugins/remark-install";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
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
      [remarkInlineCode],
      [remarkDocGen, { generators: [fileGenerator()] } as RemarkDocGenOptions],
    ],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed",
      },
      inline: "tailing-curly-colon",
      defaultLanguage: "ts",
      // @ts-expect-error tab should be boolean
      tab: true,
    },
  },
});
