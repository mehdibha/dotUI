import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

// import { fileGenerator } from "@/modules/docs/lib/mdx-plugins/file-generator";
// import {
//   type RemarkDocGenOptions,
//   remarkDocGen,
// } from "@/modules/docs/lib/mdx-plugins/remark-docgen";
// import remarkInlineCode from "@/modules/docs/lib/mdx-plugins/remark-inline-code";
// import type { RemarkInstallOptions } from "@/modules/docs/lib/mdx-plugins/remark-install";
// import { remarkInstall } from "@/modules/docs/lib/mdx-plugins/remark-install";

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
  plugins: [lastModified()],
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      defaultLanguage: "tsx",
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      tab: true,
    },
  },
});