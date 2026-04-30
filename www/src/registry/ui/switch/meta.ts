import type { RegistryItem } from "@/registry/types";

const switchMeta = {
	name: "switch",
	type: "registry:ui",
	group: "selection-controls",
	files: [
		{
			type: "registry:ui",
			path: "ui/switch/base.tsx",
			target: "ui/switch.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default switchMeta;

