/**
 * Build the `registry:base` (a.k.a. "init") item that `shadcn init` consumes.
 *
 * Pragmatic MVP: rather than trying to translate every `@theme {…}` /
 * `@utility {…}` block in `www/src/registry/base/*.css` into shadcn's
 * structured `cssVars` / `css` schema, we ship the bundled CSS verbatim as a
 * single `registry:file`. Consumers `@import` it from their globals. The
 * preset's *global* tokens (radius factor, palette overrides, etc.) become a
 * small inline `:root { … }` block at the bottom of the bundled file.
 *
 * Pure JS — no `ts-morph`, no React. Safe to import in route handlers, BUT
 * relies on the CSS sources being readable at runtime (we inline them at
 * build via Vite's `?raw` import).
 */

import type { Density, RegistryItem } from "@/registry/types";

import type { PublishPreset } from "./types";

/**
 * Default css bundle. Routes get this at request time from the
 * `?raw` Vite imports in the route module — keeping the assembly here
 * means we only have to maintain the schema in one place.
 */
export interface EmitThemeInput {
	/** Concatenated CSS sources (base.css, colors.css, theme.css). */
	bundledBaseCss: string;
	/** The preset to bake into the init item. */
	preset: PublishPreset;
	/** Encoded preset string — gets put in `config.registries.@dotui.params.preset`. */
	encodedPreset?: string;
	/** Root URL of the deployed registry, e.g. `https://dotui.com`. */
	registryRoot: string;
}

const DEFAULT_DEPENDENCIES = [
	"tailwind-variants",
	"clsx",
	"tailwind-merge",
	"react-aria-components",
	"tailwindcss-react-aria-components",
	"tw-animate-css",
	"tailwindcss-autocontrast",
];

// shadcn's `utils` (the `cn` helper) lives in a 4xx-gated path on the default
// registry under v4 Tailwind, so we ship our own copy inside this item's
// `files[]` instead of declaring it as a `registryDependencies` entry.
const DEFAULT_REGISTRY_DEPENDENCIES: string[] = [];

const CN_UTILS_TS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
\treturn twMerge(clsx(inputs));
}
`;

/**
 * Map the preset's compact density key to a `:root` declaration. dotui's
 * default density is `compact`, so an empty value omits the declaration.
 */
function densityRootDecl(density: Density): string | undefined {
	if (density === "compact") return undefined;
	return `--dotui-density: ${density};`;
}

function emitPresetRoot(preset: PublishPreset): string {
	const lines: string[] = [];
	const density = densityRootDecl(preset.density);
	if (density) lines.push(density);
	// Global tokens — `componentParams` are inlined into component classes at
	// build, so we don't write them here. Only the registry's *global* tokens
	// (radius factor, palette overrides, cursors) make it onto `:root`.
	// Those live in `preset.tokens` once we wire it through; the publisher's
	// PublishPreset shape doesn't expose them yet — left as a TODO for a
	// follow-up that threads `tokens` from the customizer.
	if (lines.length === 0) return "";
	return `\n/* dotUI preset overrides */\n:root {\n\t${lines.join("\n\t")}\n}\n`;
}

export function emitInitItem(input: EmitThemeInput): RegistryItem {
	const { bundledBaseCss, preset, encodedPreset, registryRoot } = input;

	const bundle = `${bundledBaseCss}\n${emitPresetRoot(preset)}`;

	// Intentionally minimal `config` block:
	// - No `tailwind.css` or `tailwind.baseColor` — shadcn detects these from
	//   the project (e.g. src/app/globals.css for a Next.js app dir). Hard-
	//   coding `src/styles/globals.css` here would override a correct
	//   detection and cause ENOENT when shadcn tries to merge cssVars into a
	//   file that doesn't exist.
	// - `cssVariables: false` because our bundled CSS already declares every
	//   theme var; we don't want shadcn injecting an extra `:root { … }`
	//   block sourced from `colors/<name>.json` (which 401s under v4 anyway).
	// - The `@dotui` registries mapping is preserved as a convenience for
	//   shadcn versions that DO merge a `registry:base`'s config block, but
	//   we don't rely on it: per-component `registryDependencies` are emitted
	//   as absolute URLs by the per-component publisher.
	const config = {
		style: "default",
		tailwind: {
			cssVariables: false,
		},
		aliases: {
			components: "@/components",
			ui: "@/components/ui",
			utils: "@/lib/utils",
			lib: "@/lib",
			hooks: "@/hooks",
		},
		registries: {
			"@dotui": {
				url: `${registryRoot}/r/{name}.json`,
				...(encodedPreset ? { params: { preset: encodedPreset } } : {}),
			},
		},
	};

	const item = {
		name: "dotui",
		// `registry:style` + `extends: "none"` tells shadcn this IS the project
		// style — don't reach for the default `styles/index.json` from
		// ui.shadcn.com during init/add.
		type: "registry:style",
		extends: "none",
		dependencies: DEFAULT_DEPENDENCIES,
		registryDependencies: DEFAULT_REGISTRY_DEPENDENCIES,
		files: [
			{
				type: "registry:file",
				path: "styles/dotui-base.css",
				target: "src/styles/dotui-base.css",
				content: bundle,
			},
			{
				type: "registry:lib",
				path: "lib/utils.ts",
				target: "src/lib/utils.ts",
				content: CN_UTILS_TS,
			},
		],
		config,
	};

	return item as unknown as RegistryItem;
}
