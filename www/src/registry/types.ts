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

export type StyleMeta = {
	description?: string;
};

/* ----------------------------- Tokens (CSS vars) ----------------------------- */

export type TokenType = "radius" | "color" | "spacing" | "font-size";

export type TokenDef = {
	type: TokenType;
	default: string;
};

/* ------------------------- Params (internal variants) ------------------------ */
/**
 * Per-component variant-style params, scoped to a single component and only
 * shown in the create page customizer. The selected value resolves to a tv
 * config slice that gets layered between density and styles. At CLI install
 * time these are baked into the exported `tv` definition.
 */
export type ParamDef = {
	type: "select";
	default: string;
	values: string[];
	description?: string;
};

export type RegistryItem = ShadcnRegistryItem &
	(
		| {
				styles: Record<string, StyleMeta>;
				defaultStyle: string;
		  }
		| { styles?: never; defaultStyle?: never }
	) & {
		/** Component group for style editor UI organization */
		group?: ComponentGroup | null;
		/** Configurable design tokens (CSS variables) resolved at install time */
		tokens?: Record<string, TokenDef>;
		/** Per-component variant params shown in the customizer panel */
		params?: Record<string, ParamDef>;
	};

export type Registry = Omit<ShadcnRegistry, "items"> & {
	items: RegistryItem[];
};
