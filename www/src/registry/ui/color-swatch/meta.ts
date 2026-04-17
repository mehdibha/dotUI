import type { RegistryItem } from "@/registry/types";

const colorSwatchMeta = {
	name: "color-swatch",
	type: "registry:ui",
	group: "color-swatches",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	params: {
		"--color-swatch-radius": {
			type: "radius",
			default: "--radius-sm",
		},
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
