import type { RegistryItem } from "@/registry/types";

const menuMeta = {
	name: "menu",
	type: "registry:ui",
	group: "overlays",
	defaultStyle: "default",
	styles: {
		default: {},
	},
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

export type MenuStyle = keyof typeof menuMeta.styles;

export const menuStyleNames = Object.keys(menuMeta.styles) as MenuStyle[];

export const defaultMenuStyle = menuMeta.defaultStyle;
