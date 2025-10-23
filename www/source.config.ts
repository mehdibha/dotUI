import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import type { RemarkInstallOptions } from "@/modules/docs/lib/mdx-plugins/remark-install";

import { fileGenerator } from "@/modules/docs/lib/mdx-plugins/file-generator";
import {
  remarkDocGen,
  type RemarkDocGenOptions,
} from "@/modules/docs/lib/mdx-plugins/remark-docgen";
import remarkInlineCode from "@/modules/docs/lib/mdx-plugins/remark-inline-code";
import { remarkInstall } from "@/modules/docs/lib/mdx-plugins/remark-install";

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
          }),
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

export const marketing = defineDocs({
  dir: "content/(root)",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
          }),
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
  lastModifiedTime: "git",
  mdxOptions: {
    remarkNpmOptions: false,
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
      tab: true as any,
    },
  },
});
