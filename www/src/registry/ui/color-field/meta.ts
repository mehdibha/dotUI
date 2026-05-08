import type { RegistryItem } from "@/registry/types";

const colorFieldMeta = {
	name: "color-field",
	type: "registry:ui",
	group: "inputs",
	files: [
		{
			type: "registry:ui",
			path: "ui/color-field/base.tsx",
			target: "ui/color-field.tsx",
		},
	],
	registryDependencies: ["field", "input"],
} satisfies RegistryItem;

export default colorFieldMeta;
