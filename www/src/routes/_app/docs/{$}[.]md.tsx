import { createFileRoute } from "@tanstack/react-router";

import { docsSource } from "@/lib/source";

export const Route = createFileRoute("/_app/docs/{$}.md")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const slugs = params._splat?.split("/") ?? [];
				let page = docsSource.getPage(slugs);
				// The docs index lives at /docs (empty slugs); serve it as /docs/index.md
				// so the index page can advertise a working markdown alternate.
				if (!page && slugs.length === 1 && slugs[0] === "index") {
					page = docsSource.getPage([]) ?? docsSource.getPage(["index"]);
				}

				if (!page) {
					return new Response("Not found", { status: 404 });
				}

				// getText("processed") returns the bundled markdown (includeProcessedMarkdown
				// in source.config); getText("raw") reads the source file from disk, which
				// 500s in the serverless runtime where content/ isn't bundled.
				const markdown = await page.data.getText("processed");
				const filename = (params._splat || "docs").split("/").join("-");

				return new Response(markdown, {
					headers: {
						"Content-Type": "text/markdown; charset=utf-8",
						"Content-Disposition": `inline; filename="${filename}.md"`,
					},
				});
			},
		},
	},
});
