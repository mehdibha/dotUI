import type { Registry as ShadcnRegistry, RegistryItem as ShadcnRegistryItem } from "shadcn/schema";

export type RegistryItem = ShadcnRegistryItem &
	(
		| {
				variants: Record<string, Omit<ShadcnRegistryItem, "name" | "type">>;
				defaultVariant: string;
		  }
		| { variants?: never; defaultVariant?: never }
	);

export type Registry = Omit<ShadcnRegistry, "items"> & {
	items: RegistryItem[];
};
