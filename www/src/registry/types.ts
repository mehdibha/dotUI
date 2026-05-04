import type { Registry as ShadcnRegistry, RegistryItem as ShadcnRegistryItem } from "shadcn/schema";

/**
 * Component groups for style editor UI organization.
 * Components in the same group share the same visual style.
 */
export type ComponentGroup =
	| "buttons"
	| "inputs"
	| "pickers"
	| "selection-controls"
	| "overlays"
	| "menus-lists"
	| "feedback"
	| "progress"
	| "tags"
	| "navigation"
	| "disclosure"
	| "containers"
	| "sliders"
	| "color-swatches"
	| "calendar"
	| "drop-zone"
	| "typography";

/* ------------------------------- Params ------------------------------- */

export type TokenType = "radius" | "color" | "spacing" | "font-size" | "blur" | "opacity";
export type RegistryItemFile = NonNullable<ShadcnRegistryItem["files"]>[number];

/**
 * An "enum" param: user picks one of a fixed set of named values.
 * Each value can carry tv slices and/or CSS vars in `createStyles`.
 * Covers what was previously `meta.styles` (aesthetic) and `meta.params`
 * (per-component variants).
 */
export type EnumParamDef = {
	kind: "enum";
	default: string;
	values: readonly string[];
	files?: Record<string, readonly RegistryItemFile[]>;
	description?: string;
};

/**
 * A "scalar" param: user picks any value from a typed pool (a token type).
 * The selected value is written to `cssVar` on `:root`. No tv slice.
 * Covers what was previously `meta.tokens`.
 */
export type ScalarParamDef = {
	kind: "scalar";
	type: TokenType;
	cssVar: `--${string}`;
	default: string;
	description?: string;
};

export type ParamDef = EnumParamDef | ScalarParamDef;

export type RegistryItem = ShadcnRegistryItem & {
	/** Component group for style editor UI organization */
	group?: ComponentGroup | null;
	/**
	 * Customization knobs surfaced in the create-page customizer.
	 * Two kinds: `enum` (1-of-N named values, may carry tv + vars) and
	 * `scalar` (a single CSS var resolved from a typed token pool).
	 */
	params?: Record<string, ParamDef>;
};

export type Registry = Omit<ShadcnRegistry, "items"> & {
	items: RegistryItem[];
};
