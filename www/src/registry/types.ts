import type { Registry as ShadcnRegistry, RegistryItem as ShadcnRegistryItem } from "shadcn/schema";

/**
 * Component groups for style editor UI organization
 */
export type ComponentGroup =
	| "buttons"
	| "inputs"
	| "selections"
	| "overlays"
	| "feedback"
	| "navigation"
	| "data-display"
	| "date-time"
	| "color"
	| "forms"
	| "layout";

export type StyleMeta = {
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
	};

export type Registry = Omit<ShadcnRegistry, "items"> & {
	items: RegistryItem[];
};
