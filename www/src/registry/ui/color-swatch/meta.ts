import type { RegistryItem } from "@/registry/types";

const colorSwatchMeta = {
	name: "color-swatch",
	type: "registry:ui",
	group: "color",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-swatch/base.tsx",
			target: "ui/color-swatch.tsx",
		},
	],
} satisfies RegistryItem;

export default colorSwatchMeta;

export type ColorSwatchStyle = keyof typeof colorSwatchMeta.styles;

export const colorSwatchStyleNames = Object.keys(colorSwatchMeta.styles) as ColorSwatchStyle[];

export const defaultColorSwatchStyle = colorSwatchMeta.defaultStyle;
