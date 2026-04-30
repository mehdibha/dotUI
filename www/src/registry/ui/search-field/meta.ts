import type { RegistryItem } from "@/registry/types";

const searchFieldMeta = {
	name: "search-field",
	type: "registry:ui",
	group: "inputs",
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

