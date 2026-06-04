import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";

// Serves /.well-known/api-catalog (RFC 9727) — a linkset that points agents at
// dotUI's real, machine-consumable resources: the shadcn component registry
// endpoint (GET /r/{name}), the installation guide, and the llms.txt index.
// This deliberately advertises only capabilities that actually exist — there is
// no MCP server, agent card, or OAuth on this static docs site, so none are
// claimed (a hollow capability card is worse than its absence).
//
// Spec: https://www.rfc-editor.org/rfc/rfc9727 — Content-Type must be
// application/linkset+json.

export const Route = createFileRoute("/.well-known/api-catalog")({
	server: {
		handlers: {
			GET: () => {
				const { url } = siteConfig;

				const linkset = {
					linkset: [
						{
							anchor: url,
							rel: "api-catalog",
							href: `${url}/.well-known/api-catalog`,
							title: "dotUI API catalog",
						},
						{
							anchor: url,
							rel: "item",
							href: `${url}/r/{name}`,
							type: "application/json",
							title:
								"dotUI shadcn component registry — GET /r/{name} returns the resolved registry item JSON for a component, consumable by the shadcn CLI and AI tooling.",
						},
						{
							anchor: url,
							rel: "service-doc",
							href: `${url}/docs/installation`,
							type: "text/html",
							title: "How to install and consume dotUI components via the registry and the shadcn CLI.",
						},
						{
							anchor: url,
							rel: "describedby",
							href: `${url}/llms.txt`,
							type: "text/plain",
							title: "llms.txt — machine-readable index of dotUI documentation for AI agents.",
						},
					],
				};

				return new Response(`${JSON.stringify(linkset, null, 2)}\n`, {
					headers: { "Content-Type": "application/linkset+json" },
				});
			},
		},
	},
});
