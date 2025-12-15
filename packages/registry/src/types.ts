import type { Registry as ShadcnRegistry, RegistryItem as ShadcnRegistryItem } from "shadcn/schema";

export type RegistryItem = ShadcnRegistryItem & {
	variants?: Record<string, Partial<ShadcnRegistryItem>>;
	defaultVariant?: string;
};

export type Registry = Omit<ShadcnRegistry, "items"> & {
	items: RegistryItem[];
};