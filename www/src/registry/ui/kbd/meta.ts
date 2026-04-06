import type { RegistryItem } from "@/registry/types";

const kbdMeta = {
	name: "kbd",
	type: "registry:ui",
	group: "data-display",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/kbd/base.tsx",
			target: "ui/kbd.tsx",
		},
	],
} satisfies RegistryItem;

export default kbdMeta;

export type KbdStyle = keyof typeof kbdMeta.styles;

export const kbdStyleNames = Object.keys(kbdMeta.styles) as KbdStyle[];

export const defaultKbdStyle = kbdMeta.defaultStyle;
