import type { RegistryItem } from "@/registry/types";

const searchFieldMeta = {
	name: "search-field",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/search-field/base.tsx",
			target: "ui/search-field.tsx",
		},
	],
	registryDependencies: ["field", "button"],
} satisfies RegistryItem;

export default searchFieldMeta;

export type SearchFieldStyle = keyof typeof searchFieldMeta.styles;

export const searchFieldStyleNames = Object.keys(searchFieldMeta.styles) as SearchFieldStyle[];

export const defaultSearchFieldStyle = searchFieldMeta.defaultStyle;
