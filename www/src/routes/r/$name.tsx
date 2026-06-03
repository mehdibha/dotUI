/**
 * GET /r/$name[?preset=…]
 *
 * Returns the resolved shadcn registry item for one dotui component. The
 * preset query param drives:
 *   - density selection (folded into class lists)
 *   - per-component enum-merge choices
 *   - scalar param values (rewritten inline into Tailwind suffixes)
 *   - enum-with-files choices (e.g. loader.style = "ring" → ship base.ring.tsx)
 *
 * `name` must match a generated publishable. Missing names return 404.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";

import { format } from "oxfmt";

import { publish, setDotuiDepResolver, setKnownDotuiNames } from "@/publisher/publish";
import { publishables, PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables";

// Prime the dep rewriter with every component name we ship. Lives at
// module scope so it runs once per route bundle load.
setKnownDotuiNames(PUBLISHABLE_NAMES);

import type { Publishable, PublishPreset } from "@/publisher/types";

const JSON_HEADERS = {
	"Content-Type": "application/json; charset=utf-8",
	"Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
};

export const Route = createFileRoute("/r/$name")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const name = params.name;
				const loader = publishables[name];
				if (!loader) throw notFound();

				const url = new URL(request.url);
				const encodedPreset = url.searchParams.get("preset") ?? undefined;
				const preset = encodedPreset ? await decodePresetForRoute(encodedPreset) : defaultPreset();

				// Configure how transitive deps get rewritten — they become absolute
				// URLs back at this same origin (with the preset preserved) so
				// `shadcn add` can follow them without a registry mapping in the
				// consumer's components.json.
				const origin = `${url.protocol}//${url.host}`;
				const depQuery = encodedPreset ? `?preset=${encodedPreset}` : "";
				setDotuiDepResolver(origin, depQuery);

				const mod = await loader();
				const publishable = selectPublishable(mod, preset);

				const { item, rawContent } = publish({ publishable, preset });

				// Run the component source through oxfmt so the consumer's `shadcn add`
				// gets clean output. Don't let formatter failures break the response —
				// the raw template still works, just less pretty.
				let formatted = rawContent;
				try {
					const result = await format(publishable.meta.files?.[0]?.target ?? "ui.tsx", rawContent, {
						printWidth: 120,
						useTabs: true,
					});
					formatted = result.code;
				} catch {
					/* fall through with raw content */
				}

				// Re-apply formatted content to every file (in practice we only ever ship one).
				if (item.files) {
					item.files = item.files.map((f) => ({ ...f, content: formatted })) as typeof item.files;
				}

				return new Response(JSON.stringify(item, null, 2), { headers: JSON_HEADERS });
			},
		},
	},
});

interface PublishableModule {
	publishable: Publishable;
	publishableByPath?: Record<string, Publishable>;
}

function selectPublishable(mod: PublishableModule, preset: PublishPreset): Publishable {
	if (!mod.publishableByPath) return mod.publishable;
	const meta = mod.publishable.meta;
	const selections = preset.componentParams[meta.name] ?? {};

	// Walk meta.params looking for the enum param whose `files` block drives
	// the file swap. The user's selected value points at one of the entries
	// in `publishableByPath`.
	for (const [paramName, def] of Object.entries(meta.params ?? {})) {
		if (def.kind !== "enum" || !def.files) continue;
		const value = selections[paramName] ?? def.default;
		const filesForValue = def.files[value];
		const targetFile = filesForValue?.[0];
		if (!targetFile) continue;
		const hit = mod.publishableByPath[targetFile.path];
		if (hit) return hit;
	}
	return mod.publishable;
}

function defaultPreset(): PublishPreset {
	return { density: "compact", componentParams: {} };
}

async function decodePresetForRoute(encoded: string): Promise<PublishPreset> {
	try {
		const { decodePreset } = await import("@/modules/create/preset/codec");
		const ds = decodePreset(encoded);
		return { density: ds.density, componentParams: ds.componentParams };
	} catch {
		return defaultPreset();
	}
}
