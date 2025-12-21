import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
	dir: "content/docs",
	docs: {
		schema: frontmatterSchema.extend({
			links: z
				.array(
					z.object({
						label: z.string(),
						href: z.string(),
					}),
				)
				.optional(),
			wip: z.boolean().optional().default(false),
		}),
	},
	meta: {
		schema: metaSchema.extend({
			description: z.string().optional(),
		}),
	},
});

export const legal = defineDocs({
	dir: "content/legal",
	docs: {
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
	mdxOptions: {
		rehypeCodeOptions: {
			...rehypeCodeDefaultOptions,
			langs: ["ts", "js", "html", "tsx", "mdx", "css", "json", "bash"],
			defaultLanguage: "plaintext",
			inline: "tailing-curly-colon",
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
			tab: true,
		},
	},
});
