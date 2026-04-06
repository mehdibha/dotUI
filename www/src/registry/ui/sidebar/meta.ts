import type { RegistryItem } from "@/registry/types";

const sidebarMeta = {
	name: "sidebar",
	type: "registry:ui",
	group: "navigation",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/sidebar/base.tsx",
			target: "ui/sidebar.tsx",
		},
	],
} satisfies RegistryItem;

export default sidebarMeta;

export type SidebarStyle = keyof typeof sidebarMeta.styles;

export const sidebarStyleNames = Object.keys(sidebarMeta.styles) as SidebarStyle[];

export const defaultSidebarStyle = sidebarMeta.defaultStyle;
