import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

import rehypeTransform from "./src/modules/docs/mdx-plugins/rehype-transform";

export const docs = defineDocs({
	dir: "content/docs",
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
});

export default defineConfig({
	plugins: [lastModified()],
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
		rehypePlugins: [rehypeTransform],
	},
});
