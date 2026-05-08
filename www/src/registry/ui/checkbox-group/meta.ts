import type { RegistryItem } from "@/registry/types";

const checkboxGroupMeta = {
	name: "checkbox-group",
	type: "registry:ui",
	group: "selection-controls",
	files: [
		{
			type: "registry:ui",
			path: "ui/checkbox-group/base.tsx",
			target: "ui/checkbox-group.tsx",
		},
	],
	registryDependencies: ["field", "checkbox"],
} satisfies RegistryItem;

export default checkboxGroupMeta;
