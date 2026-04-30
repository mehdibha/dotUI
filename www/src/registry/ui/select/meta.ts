import type { RegistryItem } from "@/registry/types";

const selectMeta = {
	name: "select",
	type: "registry:ui",
	group: "pickers",
	files: [
		{
			type: "registry:ui",
			path: "ui/select/base.tsx",
			target: "ui/select.tsx",
		},
	],
	registryDependencies: ["button", "field", "list-box", "popover"],
} satisfies RegistryItem;

export default selectMeta;

