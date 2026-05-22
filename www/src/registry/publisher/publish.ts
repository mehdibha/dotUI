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
		...(meta.registryDependencies ? { registryDependencies: meta.registryDependencies } : {}),
		files,
	};
	const item = itemShape as unknown as RegistryItem;

	return { item, rawContent: content };
}
