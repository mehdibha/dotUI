/**
 * Request-time orchestrator. Given a publishable (the build-time artifact
 * for one component) and a preset, return a shadcn registry item with one
 * inline file whose tv config is fully resolved against the preset.
 *
 * Pure JS — no `ts-morph`, no React. Safe to import in route handlers.
 *
 * Pipeline:
 *   1. flatten         — merge base ← density ← param-value layers
 *   2. resolveClasses  — rewrite scalar-param var refs to Tailwind suffixes
 *   3. serialize       — render the flat config to a TS literal string
 *   4. substitute      — splice into the template at `%%TV_CONFIG%%`
 *   5. assemble        — build the shadcn-shaped JSON
 *
 * Step 6 (oxfmt) lives outside this module — callers feed the assembled
 * content through `oxfmt.format` since that's async and route-side.
 */

import { flatten } from "./flatten";
import { buildScalarVarMap, resolveClasses } from "./resolve-classes";
import { serializeTvConfig } from "./serialize";

import type { Publishable, PublishPreset } from "./types";

import type { RegistryItem } from "@/registry/types";

export const TV_CONFIG_PLACEHOLDER = "%%TV_CONFIG%%";

/**
 * Registry namespace dotui ships under. Used to prefix `registryDependencies`
 * so consumers resolve transitive items from our registry instead of the
 * default shadcn registry.
 */
export const DOTUI_NAMESPACE = "@dotui";

/**
 * Names of registry items that live in the dotui registry — i.e. anything
 * that has a publishable. Used to decide which `registryDependencies` need
 * the `@dotui/` prefix and which (like `utils`) flow through verbatim.
 *
 * Populated lazily from the generated publishables index when available,
 * otherwise defaults to the empty set (consumer-side: dotui knows its own
 * components).
 */
let knownDotuiNames: Set<string> | undefined;

/**
 * Names of registry items the consumer already has after `shadcn init`
 * because they're baked into the registry:base bundle. These don't need
 * to be (and shouldn't be) listed as registry dependencies on individual
 * components — shadcn would 404 trying to fetch them from us, and they
 * don't exist on the default shadcn registry either.
 */
const BUNDLED_INTO_INIT = new Set([
	// focus-ring / focus-reset / focus-input utilities ship in base.css.
	"focus-styles",
	// @theme blocks ship in theme.css.
	"theme",
]);

export function setKnownDotuiNames(names: Iterable<string>): void {
	knownDotuiNames = new Set(names);
}

function namespaceDeps(deps: readonly string[] | undefined): string[] | undefined {
	if (!deps || deps.length === 0) return undefined;
	const known = knownDotuiNames;
	const out: string[] = [];
	for (const dep of deps) {
		// Drop deps that the consumer already has from the init bundle.
		if (BUNDLED_INTO_INIT.has(dep)) continue;
		// Already namespaced or fully-qualified URL? leave alone.
		if (dep.includes("/") || dep.includes(":")) {
			out.push(dep);
			continue;
		}
		out.push(known?.has(dep) ? `${DOTUI_NAMESPACE}/${dep}` : dep);
	}
	return out.length > 0 ? out : undefined;
}

export interface PublishedItem {
	/** Shadcn-shaped registry item ready to JSON.stringify. */
	item: RegistryItem;
	/** The pre-format component source — caller passes this through oxfmt. */
	rawContent: string;
}

export interface PublishInput {
	publishable: Publishable;
	preset: PublishPreset;
}

export function publish({ publishable, preset }: PublishInput): PublishedItem {
	const { template, stylesConfig, meta } = publishable;
	const paramSelections = preset.componentParams[meta.name] ?? {};

	// 1. Flatten base + density + param layers.
	const flat = flatten({
		stylesConfig,
		meta,
		density: preset.density,
		paramSelections,
	});

	// 2. Rewrite scalar-param var refs to Tailwind suffixes.
	const varMap = buildScalarVarMap(meta, paramSelections);
	const resolved = resolveClasses(flat, varMap);

	// 3+4. Serialize and substitute.
	const literal = serializeTvConfig(resolved);
	const content = template.replace(TV_CONFIG_PLACEHOLDER, literal);

	// 5. Assemble shadcn item — drop dotui-only fields (params, group).
	// Shadcn's RegistryItem is a discriminated union on `type`. We can't carry the
	// discriminant through generic plumbing, so we build a structurally-correct
	// object and cast at the boundary.
	const files = (meta.files ?? []).map((file) => ({ ...file, content }));

	const itemShape = {
		name: meta.name,
		type: meta.type,
		...(meta.title !== undefined ? { title: meta.title } : {}),
		...(meta.description !== undefined ? { description: meta.description } : {}),
		...(meta.dependencies ? { dependencies: meta.dependencies } : {}),
		...(meta.registryDependencies
			? { registryDependencies: namespaceDeps(meta.registryDependencies) ?? meta.registryDependencies }
			: {}),
		files,
	};
	const item = itemShape as unknown as RegistryItem;

	return { item, rawContent: content };
}
