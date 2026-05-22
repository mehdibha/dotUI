import type { RegistryItem } from "@/registry/types";

const sidebarMeta = {
	name: "sidebar",
	type: "registry:ui",
	group: "navigation",
	files: [
		{
			type: "registry:ui",
			path: "ui/sidebar/base.tsx",
			target: "ui/sidebar.tsx",
		},
	],
} satisfies RegistryItem;

export default sidebarMeta;
