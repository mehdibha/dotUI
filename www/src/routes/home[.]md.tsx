import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";

// Serves /home.md — a concise markdown view of the homepage for AI agents.
// Reached via content negotiation: a request to "/" carrying
// `Accept: text/markdown` is rewritten here (see www/vercel.ts), so agents get
// clean markdown from the same URL browsers get HTML. Also linked from the page
// <head> as <link rel="alternate" type="text/markdown">.

const BODY = `# dotUI

> ${siteConfig.description}

dotUI is a design system platform and component registry built on React Aria Components, Tailwind CSS 4, and TypeScript 5. Generate a UI library that looks like your product — not a preset — with the style editor, then consume it through the shadcn CLI, the registry endpoint, or AI tooling like v0.

## Documentation

- Introduction: ${siteConfig.url}/docs
- Installation: ${siteConfig.url}/docs/installation
- Components index (llms.txt): ${siteConfig.url}/llms.txt
- Full documentation, single file (llms-full.txt): ${siteConfig.url}/llms-full.txt
- Component registry API: GET ${siteConfig.url}/r/{name}

## Links

- GitHub: ${siteConfig.links.github}
- X (Twitter): ${siteConfig.links.twitter}
- Discord: ${siteConfig.links.discord}
`;

export const Route = createFileRoute("/home.md")({
	server: {
		handlers: {
			GET: () =>
				new Response(BODY, {
					headers: { "Content-Type": "text/markdown; charset=utf-8" },
				}),
		},
	},
});
