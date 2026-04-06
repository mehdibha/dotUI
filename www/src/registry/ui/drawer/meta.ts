import type { RegistryItem } from "@/registry/types";

const drawerMeta = {
	name: "drawer",
	type: "registry:ui",
	group: "overlays",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/drawer/base.tsx",
			target: "ui/drawer.tsx",
		},
	],
} satisfies RegistryItem;

export default drawerMeta;

export type DrawerStyle = keyof typeof drawerMeta.styles;

export const drawerStyleNames = Object.keys(drawerMeta.styles) as DrawerStyle[];

export const defaultDrawerStyle = drawerMeta.defaultStyle;
