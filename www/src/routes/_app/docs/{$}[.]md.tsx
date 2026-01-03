import { createFileRoute } from "@tanstack/react-router";

import { docsSource } from "@/lib/source";

export const Route = createFileRoute("/_app/docs/{$}.md")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const slugs = params._splat?.split("/") ?? [];
				const page = docsSource.getPage(slugs);

				if (!page) {
					return new Response("Not found", { status: 404 });
				}

				const rawContent = await page.data.getText("raw");
				const filename = (params._splat || "docs").split("/").join("-");

				return new Response(rawContent, {
					headers: {
						"Content-Type": "text/markdown; charset=utf-8",
						"Content-Disposition": `inline; filename="${filename}.md"`,
					},
				});
			},
		},
	},
});
