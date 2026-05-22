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
	params: {
		highlight: {
			kind: "enum",
			default: "subtle",
			values: ["subtle", "accent"] as const,
			description: "How focused/active items are highlighted.",
		},
	},
} satisfies RegistryItem;

export default menuMeta;
