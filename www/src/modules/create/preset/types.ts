/**
 * Compact representation for URL serialization.
 * Short keys minimize encoded size.
 *   s = component styles  (e.g. { accordion: "hammamet" })
 *   p = component params  (e.g. { "--badge-radius": "--radius-full" })
 */
export type DesignSystemState = {
	s?: Record<string, string>;
	p?: Record<string, string>;
};

/**
 * Readable representation used by UI components.
 */
export type DesignSystem = {
	componentStyles: Record<string, string>;
	componentParams: Record<string, string>;
};

export function toCompact(ds: DesignSystem): DesignSystemState {
	const state: DesignSystemState = {};
	if (Object.keys(ds.componentStyles).length > 0) state.s = ds.componentStyles;
	if (Object.keys(ds.componentParams).length > 0) state.p = ds.componentParams;
	return state;
}

export function fromCompact(state: DesignSystemState): DesignSystem {
	return {
		componentStyles: state.s ?? {},
		componentParams: state.p ?? {},
	};
}
