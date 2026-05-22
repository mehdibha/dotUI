/**
 * Flatten a `StylesConfig` (base + density layers + per-param value layers)
 * into a single `tv` layer for the user's preset selection.
 *
 * The dotui runtime does this by chaining `tv({ extend, … })` calls — so the
 * emitted classes from chained layers are simply concatenated for the same
 * slot/variant/value. We mirror that semantics here as plain object merging.
 *
 * Merge order matches `createStyles` runtime composition:
 *   base ← density[selectedDensity] ← params[name][selectedValue]  (in meta order)
 *
 * `vars` keys on override layers are dropped — they're a runtime concern
 * (applied to `:root` by the dotui provider) and have no place in a published
 * component file.
 */

import type { Density, EnumParamDef, RegistryItem } from "@/registry/types";

import type { ClassValue, OverrideLayer, StylesConfig, TvLayer, VariantSliceValue } from "./types";

/* -------------------------------- class merge -------------------------------- */

function toClassArray(value: ClassValue | undefined): string[] {
	if (value == null || value === false) return [];
	if (Array.isArray(value)) return value.flatMap(toClassArray);
	if (typeof value === "string") return value === "" ? [] : [value];
	return [];
}

/** Concatenate two class values, normalising to a single string or string[]. */
function mergeClass(a: ClassValue | undefined, b: ClassValue | undefined): ClassValue | undefined {
	const combined = [...toClassArray(a), ...toClassArray(b)];
	if (combined.length === 0) return undefined;
	if (combined.length === 1) return combined[0];
	return combined;
}

function isSlotMap(value: VariantSliceValue | undefined): value is Record<string, ClassValue> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeVariantSlice(a: VariantSliceValue | undefined, b: VariantSliceValue | undefined): VariantSliceValue {
	if (a === undefined) return b as VariantSliceValue;
	if (b === undefined) return a;

	const aIsSlot = isSlotMap(a);
	const bIsSlot = isSlotMap(b);

	if (!aIsSlot && !bIsSlot) {
		return mergeClass(a as ClassValue, b as ClassValue) as VariantSliceValue;
	}

	// If either side is a slot map we treat both as slot maps. A flat string
	// alongside a slot map is undefined behaviour in dotui base files; fail
	// loudly so the build catches it.
	if (aIsSlot !== bIsSlot) {
		throw new Error("[publisher] cannot merge slot-map and flat-class variant value");
	}

	const result: Record<string, ClassValue> = {};
	const keys = new Set<string>([...Object.keys(a as object), ...Object.keys(b as object)]);
	for (const key of keys) {
		const aSlot = (a as Record<string, ClassValue>)[key];
		const bSlot = (b as Record<string, ClassValue>)[key];
		const merged = mergeClass(aSlot, bSlot);
		if (merged !== undefined) result[key] = merged;
	}
	return result;
}

/* --------------------------------- merge tv --------------------------------- */

function mergeSlots(
	a: Record<string, ClassValue> | undefined,
	b: Record<string, ClassValue> | undefined,
): Record<string, ClassValue> | undefined {
	if (!a && !b) return undefined;
	const result: Record<string, ClassValue> = {};
	const keys = new Set<string>([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
	for (const key of keys) {
		const merged = mergeClass(a?.[key], b?.[key]);
		if (merged !== undefined) result[key] = merged;
	}
	return Object.keys(result).length > 0 ? result : undefined;
}

function mergeVariants(
	a: TvLayer["variants"],
	b: TvLayer["variants"],
): TvLayer["variants"] | undefined {
	if (!a && !b) return undefined;
	const result: NonNullable<TvLayer["variants"]> = {};
	const variantNames = new Set<string>([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
	for (const variantName of variantNames) {
		const aValues = a?.[variantName] ?? {};
		const bValues = b?.[variantName] ?? {};
		const valuesMerged: Record<string, VariantSliceValue> = {};
		const valueNames = new Set<string>([...Object.keys(aValues), ...Object.keys(bValues)]);
		for (const valueName of valueNames) {
			valuesMerged[valueName] = mergeVariantSlice(aValues[valueName], bValues[valueName]);
		}
		result[variantName] = valuesMerged;
	}
	return result;
}

function mergeLayer(a: TvLayer, b: TvLayer): TvLayer {
	const merged: TvLayer = {};

	const base = mergeClass(a.base, b.base);
	if (base !== undefined) merged.base = base;

	const slots = mergeSlots(a.slots, b.slots);
	if (slots) merged.slots = slots;

	const variants = mergeVariants(a.variants, b.variants);
	if (variants) merged.variants = variants;

	// defaultVariants: later layer wins per key.
	if (a.defaultVariants || b.defaultVariants) {
		merged.defaultVariants = { ...a.defaultVariants, ...b.defaultVariants };
	}

	// compoundVariants: concat both lists in order.
	const compoundVariants = [...(a.compoundVariants ?? []), ...(b.compoundVariants ?? [])];
	if (compoundVariants.length > 0) merged.compoundVariants = compoundVariants;

	return merged;
}

/* --------------------------------- entry --------------------------------- */

function stripVars(layer: OverrideLayer): TvLayer {
	const { vars: _vars, ...rest } = layer;
	return rest;
}

export interface FlattenInput {
	stylesConfig: StylesConfig;
	meta: RegistryItem;
	density: Density;
	/** User's selections for this component, e.g. { variant: "primary", style: "sousse" }. */
	paramSelections: Record<string, string>;
}

/**
 * Flatten the styles config for a given density + param selection.
 * Returns one tv-shaped layer that, when fed to `tv(...)`, produces the same
 * classes the dotui app would render for that selection.
 */
export function flatten({ stylesConfig, meta, density, paramSelections }: FlattenInput): TvLayer {
	let current: TvLayer = stylesConfig.base;

	const densityLayer = stylesConfig.density?.[density];
	if (densityLayer) {
		current = mergeLayer(current, stripVars(densityLayer));
	}

	// Apply enum params in meta declaration order.
	const params = (meta.params ?? {}) as Record<string, EnumParamDef | { kind: string; default: string }>;
	for (const [paramName, def] of Object.entries(params)) {
		if (def.kind !== "enum") continue;
		const selectedValue = paramSelections[paramName] ?? def.default;
		const overrideLayer = stylesConfig.params?.[paramName]?.[selectedValue];
		if (!overrideLayer) continue;
		const layer = stripVars(overrideLayer);
		// Skip if the layer is effectively empty.
		if (Object.keys(layer).length === 0) continue;
		current = mergeLayer(current, layer);
	}

	return current;
}
