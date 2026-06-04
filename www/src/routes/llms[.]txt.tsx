import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";
import { docsSource, legalSource } from "@/lib/source";

// Serves /llms.txt — the llmstxt.org index: an H1, a blockquote summary, then
// H2 sections of `[name](url): description` links. The component list is
// generated from the docs source so it can never drift from the docs tree as
// components are added or removed. The app prerenders, so this is emitted as a
// static /llms.txt at build time.
//
// Spec: https://llmstxt.org/
// Returned as text/plain; charset=utf-8 — the spec's recommendation and the most
// broadly compatible content type for this file.

const SUMMARY =
	"dotUI is a design system platform and component registry built on React Aria Components, Tailwind CSS 4, and TypeScript 5. Generate a branded UI library in minutes with the style editor, then consume it through the shadcn CLI, the registry endpoint (https://dotui.org/r/{name}), or AI tooling like v0. Append .md to any docs URL for its raw markdown, or read https://dotui.org/llms-full.txt for the entire documentation in a single file.";

type DocLink = { url: string; data: { title?: string; description?: string } };

function formatList(pages: DocLink[]): string[] {
	return pages
		.slice()
		.sort((a, b) => a.url.localeCompare(b.url))
		.map((page) => {
			const title = page.data.title ?? page.url;
			const description = page.data.description ? `: ${page.data.description}` : "";
			return `- [${title}](${siteConfig.url}${page.url})${description}`;
		});
}

export const Route = createFileRoute("/llms.txt")({
	server: {
		handlers: {
			GET: () => {
				const docs = docsSource.getPages();
				const gettingStarted = docs.filter((page) => !page.url.startsWith("/docs/components/"));
				const components = docs.filter((page) => page.url.startsWith("/docs/components/"));
				const legal = legalSource.getPages();

				const body =
					[
						"# dotUI",
						"",
						`> ${SUMMARY}`,
						"",
						"## Getting started",
						"",
						...formatList(gettingStarted),
						"",
						"## Components",
						"",
						...formatList(components),
						"",
						"## Optional",
						"",
						...formatList(legal),
					].join("\n") + "\n";

				return new Response(body, {
					headers: { "Content-Type": "text/plain; charset=utf-8" },
				});
			},
		},
	},
});
