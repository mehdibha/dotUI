export type Density = "compact" | "default" | "comfortable";

/**
 * Compact representation for URL serialization.
 * Short keys minimize encoded size.
 *   s = component styles  (e.g. { accordion: "hammamet" })
 *   t = component tokens  (CSS vars, e.g. { "--badge-radius": "--radius-full" })
 *   p = component params  (per-component variants, e.g. { listbox: { layout: "compact" } })
 *   d = density           (e.g. "compact")
 */
export type DesignSystemState = {
	s?: Record<string, string>;
	t?: Record<string, string>;
	p?: Record<string, Record<string, string>>;
	d?: Density;
};

/**
 * Readable representation used by UI components.
 */
export type DesignSystem = {
	componentStyles: Record<string, string>;
	componentTokens: Record<string, string>;
	componentParams: Record<string, Record<string, string>>;
	density: Density;
};

export function toCompact(ds: DesignSystem): DesignSystemState {
	const state: DesignSystemState = {};
	if (Object.keys(ds.componentStyles).length > 0) state.s = ds.componentStyles;
	if (Object.keys(ds.componentTokens).length > 0) state.t = ds.componentTokens;
	if (Object.keys(ds.componentParams).length > 0) state.p = ds.componentParams;
	return state;
}

export function fromCompact(state: DesignSystemState): DesignSystem {
	return {
		componentStyles: state.s ?? {},
		componentTokens: state.t ?? {},
		componentParams: state.p ?? {},
		density: state.d ?? "compact",
	};
}
