import { deflateRaw, inflateRaw } from "pako";

import { DEFAULTS } from "./defaults";
import { fromCompact } from "./types";
import type { DesignSystem, DesignSystemState } from "./types";

/* ----------------------------- base64url helpers ----------------------------- */

function toBase64Url(bytes: Uint8Array): string {
	const binary = String.fromCharCode(...bytes);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
	const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (str.length % 4)) % 4);
	const binary = atob(padded);
	return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/* ------------------------------ diff helpers ------------------------------ */

/** Remove entries that match defaults, returning only overrides. */
function diffRecords(
	current: Record<string, string>,
	defaults: Record<string, string>,
): Record<string, string> | undefined {
	const result: Record<string, string> = {};
	let hasEntries = false;
	for (const [key, value] of Object.entries(current)) {
		if (value !== defaults[key]) {
			result[key] = value;
			hasEntries = true;
		}
	}
	return hasEntries ? result : undefined;
}

/* --------------------------------- encode --------------------------------- */

/**
 * Encode a DesignSystem into a compact URL-safe string.
 * Returns `undefined` when all values match defaults (no preset needed).
 */
export function encodePreset(ds: DesignSystem): string | undefined {
	const compact: DesignSystemState = {};

	const styleDiff = diffRecords(ds.componentStyles, DEFAULTS.componentStyles);
	if (styleDiff) compact.s = styleDiff;

	const paramDiff = diffRecords(ds.componentParams, DEFAULTS.componentParams);
	if (paramDiff) compact.p = paramDiff;

	if (ds.density !== DEFAULTS.density) compact.d = ds.density;

	if (!compact.s && !compact.p && !compact.d) return undefined;

	const json = JSON.stringify(compact);
	const compressed = deflateRaw(json, { level: 9 });
	return toBase64Url(compressed);
}

/* --------------------------------- decode --------------------------------- */

/**
 * Decode a preset string back into a full DesignSystem.
 * Falls back to defaults on any error.
 */
export function decodePreset(encoded: string): DesignSystem {
	try {
		const bytes = fromBase64Url(encoded);
		const json = inflateRaw(bytes, { to: "string" });
		const partial: DesignSystemState = JSON.parse(json);
		const ds = fromCompact(partial);
		return {
			componentStyles: { ...DEFAULTS.componentStyles, ...ds.componentStyles },
			componentParams: { ...DEFAULTS.componentParams, ...ds.componentParams },
			density: ds.density,
		};
	} catch {
		return DEFAULTS;
	}
}
