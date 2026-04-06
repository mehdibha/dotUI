import type { RegistryItem } from "@/registry/types";

const separatorMeta = {
	name: "separator",
	type: "registry:ui",
	group: "layout",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/separator/base.tsx",
			target: "ui/separator.tsx",
		},
	],
} satisfies RegistryItem;

export default separatorMeta;

export type SeparatorStyle = keyof typeof separatorMeta.styles;

export const separatorStyleNames = Object.keys(separatorMeta.styles) as SeparatorStyle[];

export const defaultSeparatorStyle = separatorMeta.defaultStyle;
