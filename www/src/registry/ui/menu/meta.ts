import type { RegistryItem } from "@/registry/types";

const menuMeta = {
	name: "menu",
	type: "registry:ui",
	group: "menus-lists",
	files: [
		{
			type: "registry:ui",
			path: "ui/menu/base.tsx",
			target: "ui/menu.tsx",
		},
	],
	registryDependencies: ["kbd", "overlay", "text"],
} satisfies RegistryItem;

export default menuMeta;

