import { createFileRoute } from "@tanstack/react-router";

import { docsSource } from "@/lib/source";

// Serves /llms-full.txt — the full markdown body of every docs page,
// concatenated into one file so an agent can ingest the entire documentation in
// a single fetch. Generated from the same source the site renders, so it can
// never drift. Served dynamically by the serverless function (cached at the edge
// via the Cache-Control header below).
//
// Spec: https://llmstxt.org/  (llms-full.txt = the full concatenated docs, not a
// link index). Returned as text/plain; charset=utf-8 for the broadest client
// compatibility (the per-page /docs/*.md route keeps text/markdown).

const HEADER = [
	"# dotUI",
	"",
	"> Full documentation for dotUI — a design system platform and component registry built on React Aria Components, Tailwind CSS 4, and TypeScript 5. Each section below is the complete markdown source of one documentation page.",
].join("\n");

// Uses getText("processed") — the bundled markdown (includeProcessedMarkdown in
// source.config) — NOT getText("raw"), which reads the original file from disk at
// runtime and 404s in the serverless function (the content/ sources aren't bundled).
async function renderPages(
	pages: { url: string; data: { title?: string; getText: (kind: "processed") => Promise<string> } }[],
) {
	return Promise.all(
		pages.map(async (page) => {
			const title = page.data.title ?? page.url;
			const body = (await page.data.getText("processed")).trim();
			return `# ${title}\n\n${body}`;
		}),
	);
}

export const Route = createFileRoute("/llms-full.txt")({
	server: {
		handlers: {
			GET: async () => {
				const docSections = await renderPages(docsSource.getPages());

				const body = [HEADER, ...docSections].join("\n\n---\n\n") + "\n";

				return new Response(body, {
					headers: {
						"Content-Type": "text/plain; charset=utf-8",
						"Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
					},
				});
			},
		},
	},
});
