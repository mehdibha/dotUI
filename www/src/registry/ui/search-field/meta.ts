import type { RegistryItem } from "@/registry/types";

const searchFieldMeta = {
	name: "search-field",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/search-field/base.tsx",
					target: "ui/search-field.tsx",
				},
			],
			registryDependencies: ["field", "button"],
		},
	},
} satisfies RegistryItem;

export default searchFieldMeta;
export const searchFieldVariants = Object.keys(searchFieldMeta.variants) as (keyof typeof searchFieldMeta.variants)[];

export type SearchFieldVariant = keyof typeof searchFieldMeta.variants;

export const defaultSearchFieldVariant = searchFieldMeta.defaultVariant;
