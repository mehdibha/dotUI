import type { RegistryItem } from "@/registry/types";

const timeFieldMeta = {
	name: "time-field",
	type: "registry:ui",
	group: "inputs",
	files: [
		{
			type: "registry:ui",
			path: "ui/time-field/base.tsx",
			target: "ui/time-field.tsx",
		},
	],
	registryDependencies: ["field", "input"],
} satisfies RegistryItem;

export default timeFieldMeta;
