import type { RegistryItem } from "@/registry/types";

const contextMenuMeta = {
	name: "context-menu",
	type: "registry:ui",
	group: "menus-lists",
	files: [
		{
			type: "registry:ui",
			path: "ui/context-menu/base.tsx",
			target: "ui/context-menu.tsx",
		},
	],
	registryDependencies: ["menu", "popover"],
} satisfies RegistryItem;

export default contextMenuMeta;
