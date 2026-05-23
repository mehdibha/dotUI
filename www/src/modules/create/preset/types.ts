export type { Density } from "@/registry/types";
import type { Density } from "@/registry/types";

/**
 * Compact representation for URL serialization. Short keys keep the encoded
 * string small.
 *   p = component params (per-component values, e.g. { alert: { style: "sousse", radius: "--radius-md" } })
 *   t = global theme tokens (CSS vars not owned by any component, e.g. { "--radius-factor": "1.25" })
 *   d = density
 */
export type DesignSystemState = {
	p?: Record<string, Record<string, string>>;
	t?: Record<string, string>;
	d?: Density;
};

/**
 * Readable representation used by the customizer and provider.
 */
export type DesignSystem = {
	/** Per-component param selections (covers what was previously styles + tokens + params). */
	componentParams: Record<string, Record<string, string>>;
	/** Global CSS vars not owned by any component (radius factor, cursor, palette overrides, etc.). */
	tokens: Record<string, string>;
	density: Density;
};

export function toCompact(ds: DesignSystem): DesignSystemState {
	const state: DesignSystemState = {};
	if (Object.keys(ds.componentParams).length > 0) state.p = ds.componentParams;
	if (Object.keys(ds.tokens).length > 0) state.t = ds.tokens;
	return state;
}

export function fromCompact(state: DesignSystemState): DesignSystem {
	return {
		componentParams: state.p ?? {},
		tokens: state.t ?? {},
		density: state.d ?? "compact",
	};
}
