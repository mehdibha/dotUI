import type { RegistryItem } from "@/registry/types";

const textMeta = {
	name: "text",
	type: "registry:ui",
	group: "typography",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/text/base.tsx",
			target: "ui/text.tsx",
		},
	],
} satisfies RegistryItem;

export default textMeta;

export type TextStyle = keyof typeof textMeta.styles;

export const textStyleNames = Object.keys(textMeta.styles) as TextStyle[];

export const defaultTextStyle = textMeta.defaultStyle;
