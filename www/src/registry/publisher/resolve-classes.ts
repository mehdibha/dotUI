/**
 * Resolve scalar-param var references in a flat tv layer.
 *
 * Input class examples (from `styles.ts`):
 *   "rounded-(--alert-radius)"        — Tailwind v4 shorthand for arbitrary CSS var
 *   "bg-(--alert-bg) text-fg"         — multiple utilities, only one is a param ref
 *
 * Given the component's `meta.params` and the user's selections, we build a
 * map `cssVar → tailwindSuffix` (e.g. `--alert-radius → md` when the preset
 * binds `alert.radius = "--radius-md"`) and rewrite matching class tokens to
 * `rounded-md` etc. References to vars NOT owned by a scalar param in this
 * component's meta are left alone — they either come from the registry's base
 * CSS or are shipped alongside as a separate file.
 */

import { tokenValueToSuffix } from "./token-map";

import type { RegistryItem, ScalarParamDef } from "@/registry/types";

import type { ClassValue, TvLayer, VariantSliceValue } from "./types";

/* ---------------------------- var → suffix map ---------------------------- */

/**
 * Build the cssVar → suffix lookup for one component's scalar params, given
 * the user's preset selection for that component. Returns an empty map when
 * there are no resolvable scalar params (other types like color/spacing are
 * left to flow through unchanged for now — they're shipped as base CSS).
 */
export function buildScalarVarMap(
	meta: RegistryItem,
	paramSelections: Record<string, string>,
): Map<string, string> {
	const map = new Map<string, string>();
	const params = meta.params ?? {};
	for (const [paramName, def] of Object.entries(params)) {
		if (def.kind !== "scalar") continue;
		const scalar = def as ScalarParamDef;
		const value = paramSelections[paramName] ?? scalar.default;
		const suffix = tokenValueToSuffix(scalar.type, value);
		if (suffix !== undefined) {
			map.set(scalar.cssVar, suffix);
		}
	}
	return map;
}

/* ----------------------------- class rewrite ----------------------------- */

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rewrite one class string. For each known (cssVar → suffix) pair, replace
 * `<prefix>-(<cssVar>)` with `<prefix>-<suffix>`. Whitespace-separated tokens
 * outside the pattern are preserved verbatim.
 */
export function rewriteClassString(input: string, varMap: Map<string, string>): string {
	if (varMap.size === 0) return input;
	let output = input;
	for (const [cssVar, suffix] of varMap) {
		const pattern = new RegExp(`-\\(${escapeRegex(cssVar)}\\)`, "g");
		output = output.replace(pattern, `-${suffix}`);
	}
	return output;
}

function rewriteClassValue(value: ClassValue | undefined, varMap: Map<string, string>): ClassValue | undefined {
	if (value == null || value === false) return value;
	if (typeof value === "string") return rewriteClassString(value, varMap);
	if (Array.isArray(value)) {
		return value.map((v) => rewriteClassValue(v, varMap) as string | string[]) as ClassValue;
	}
	return value;
}

function isSlotMap(value: VariantSliceValue | undefined): value is Record<string, ClassValue> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rewriteVariantSlice(value: VariantSliceValue | undefined, varMap: Map<string, string>): VariantSliceValue | undefined {
	if (value === undefined) return undefined;
	if (isSlotMap(value)) {
		const result: Record<string, ClassValue> = {};
		for (const [slot, slotValue] of Object.entries(value)) {
			const rewritten = rewriteClassValue(slotValue, varMap);
			if (rewritten !== undefined) result[slot] = rewritten;
		}
		return result;
	}
	return rewriteClassValue(value, varMap);
}

/**
 * Walk a flat tv layer and rewrite all class strings using `varMap`.
 * Returns a new layer; the input is not mutated.
 */
export function resolveClasses(layer: TvLayer, varMap: Map<string, string>): TvLayer {
	if (varMap.size === 0) return layer;

	const out: TvLayer = {};

	if (layer.base !== undefined) {
		out.base = rewriteClassValue(layer.base, varMap);
	}

	if (layer.slots) {
		const slots: Record<string, ClassValue> = {};
		for (const [k, v] of Object.entries(layer.slots)) {
			const rewritten = rewriteClassValue(v, varMap);
			if (rewritten !== undefined) slots[k] = rewritten;
		}
		out.slots = slots;
	}

	if (layer.variants) {
		const variants: NonNullable<TvLayer["variants"]> = {};
		for (const [variantName, values] of Object.entries(layer.variants)) {
			const valuesOut: Record<string, VariantSliceValue> = {};
			for (const [valueName, sliceValue] of Object.entries(values)) {
				const rewritten = rewriteVariantSlice(sliceValue, varMap);
				if (rewritten !== undefined) valuesOut[valueName] = rewritten;
			}
			variants[variantName] = valuesOut;
		}
		out.variants = variants;
	}

	if (layer.defaultVariants) out.defaultVariants = layer.defaultVariants;

	if (layer.compoundVariants) {
		out.compoundVariants = layer.compoundVariants.map((cv) => {
			const result: Record<string, unknown> = {};
			for (const [k, v] of Object.entries(cv)) {
				if (k === "class" || k === "className") {
					const rewritten = rewriteClassValue(v as ClassValue, varMap);
					if (rewritten !== undefined) result[k] = rewritten;
				} else {
					result[k] = v;
				}
			}
			return result;
		});
	}

	return out;
}
