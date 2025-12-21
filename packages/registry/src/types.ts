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

export type RegistryItem = ShadcnRegistryItem &
	(
		| {
				variants: Record<string, Omit<ShadcnRegistryItem, "name" | "type">>;
				defaultVariant: string;
		  }
		| { variants?: never; defaultVariant?: never }
	) & {
		/** Component group for style editor UI organization */
		group?: ComponentGroup | null;
	};

export type Registry = Omit<ShadcnRegistry, "items"> & {
	items: RegistryItem[];
};
