import type { RegistryItem } from "@/registry/types";

const fieldMeta = {
	name: "field",
	type: "registry:ui",
	group: "inputs",
	files: [
		{
			type: "registry:ui",
			path: "ui/field/base.tsx",
			target: "ui/field.tsx",
		},
	],
	registryDependencies: ["text"],
} satisfies RegistryItem;

export default fieldMeta;
