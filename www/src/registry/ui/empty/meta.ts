import type { RegistryItem } from "@/registry/types";

const emptyMeta = {
	name: "empty",
	type: "registry:ui",
	group: "feedback",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/empty/base.tsx",
			target: "ui/empty.tsx",
		},
	],
} satisfies RegistryItem;

export default emptyMeta;

export type EmptyStyle = keyof typeof emptyMeta.styles;

export const emptyStyleNames = Object.keys(emptyMeta.styles) as EmptyStyle[];

export const defaultEmptyStyle = emptyMeta.defaultStyle;
