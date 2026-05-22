import type { RegistryItem } from "@/registry/types";

const tabsMeta = {
	name: "tabs",
	type: "registry:ui",
	group: "navigation",
	files: [
		{
			type: "registry:ui",
			path: "ui/tabs/base.tsx",
			target: "ui/tabs.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default tabsMeta;
