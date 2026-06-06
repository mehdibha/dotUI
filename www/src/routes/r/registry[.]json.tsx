/**
 * GET /r/registry.json
 *
 * The shadcn registry INDEX for dotui — the discovery manifest listing every
 * installable component. shadcn-compatible CLIs and AI tooling fetch this to
 * enumerate the registry before resolving an individual component via
 * GET /r/{name}. Without it a consumer must already know exact component names;
 * this is the catalog endpoint the protocol expects at a registry root.
 *
 * Source of truth is `PUBLISHABLE_NAMES` — the exact set GET /r/{name} can
 * serve — so the index never advertises a component that would 404 (components
 * whose `base.tsx` fails to extract are skipped from both). Per-item metadata is
 * enriched from the committed `registryUi` manifest. `lib` primitives (utils,
 * focus-styles) are intentionally absent: they ship bundled in the
 * `registry:base` item served by GET /r/init, not as standalone `add` targets.
 *
 * The per-item shape is intentionally lightweight: identity + dependency
 * metadata for discovery. The full, preset-resolved item (with file contents)
 * comes from GET /r/{name}. dotui-only fields (`group`, `params`) and
 * install-time fields (`css`, `cssVars`, `files`) are dropped here.
 *
 * `homepage` is derived from the request origin so the index is correct on any
 * deployment (prod, preview, local) without hardcoding a domain.
 */

import { createFileRoute } from "@tanstack/react-router";

import { PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables";
import { registryUi } from "@/registry/__generated__/registry-items";

const JSON_HEADERS = {
	"Content-Type": "application/json; charset=utf-8",
	"Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
};

const META_BY_NAME = new Map(registryUi.map((item) => [item.name, item]));

/** Identity + dependency fields a discovery client needs; everything resolved per-item lives at /r/{name}. */
function toIndexItem(name: string) {
	const item = META_BY_NAME.get(name);
	if (!item) return { name, type: "registry:ui" };
	return {
		name: item.name,
		type: item.type,
		...(item.title !== undefined ? { title: item.title } : {}),
		...(item.description !== undefined ? { description: item.description } : {}),
		...(item.dependencies ? { dependencies: item.dependencies } : {}),
		...(item.registryDependencies ? { registryDependencies: item.registryDependencies } : {}),
	};
}

export const Route = createFileRoute("/r/registry.json")({
	server: {
		handlers: {
			GET: ({ request }) => {
				const url = new URL(request.url);
				const homepage = `${url.protocol}//${url.host}`;

				const items = [...PUBLISHABLE_NAMES].sort((a, b) => a.localeCompare(b)).map(toIndexItem);

				const registry = {
					$schema: "https://ui.shadcn.com/schema/registry.json",
					name: "dotui",
					homepage,
					items,
				};

				return new Response(JSON.stringify(registry, null, 2), { headers: JSON_HEADERS });
			},
		},
	},
});
