import type { RegistryItem } from "@/registry/types";

const dateFieldMeta = {
	name: "date-field",
	type: "registry:ui",
	group: "inputs",
	files: [
		{
			type: "registry:ui",
			path: "ui/date-field/base.tsx",
			target: "ui/date-field.tsx",
		},
	],
	registryDependencies: ["field", "input"],
} satisfies RegistryItem;

export default dateFieldMeta;
