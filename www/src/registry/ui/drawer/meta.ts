import type { RegistryItem } from "@/registry/types";

const drawerMeta = {
	name: "drawer",
	type: "registry:ui",
	group: "overlays",
	dependencies: ["@base-ui/react"],
	files: [
		{
			type: "registry:ui",
			path: "ui/drawer/base.tsx",
			target: "ui/drawer.tsx",
		},
	],
} satisfies RegistryItem;

export default drawerMeta;
