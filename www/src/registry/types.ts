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

export type ParamType = "radius" | "color" | "spacing" | "font-size";

export type ParamDef = {
	type: ParamType;
	default: string;
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
		/** Configurable style parameters (e.g. radius, spacing) resolved at install time */
		params?: Record<string, ParamDef>;
	};

export type Registry = Omit<ShadcnRegistry, "items"> & {
	items: RegistryItem[];
};
