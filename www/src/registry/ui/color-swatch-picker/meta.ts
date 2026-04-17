import type { RegistryItem } from "@/registry/types";

const colorSwatchPickerMeta = {
	name: "color-swatch-picker",
	type: "registry:ui",
	group: "color",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	params: {
		"--color-swatch-picker-item-radius": {
			type: "radius",
			default: "--radius-md",
		},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-swatch-picker/base.tsx",
			target: "ui/color-swatch-picker.tsx",
		},
	],
	registryDependencies: ["focus-styles", "color-swatch"],
} satisfies RegistryItem;

export default colorSwatchPickerMeta;

export type ColorSwatchPickerStyle = keyof typeof colorSwatchPickerMeta.styles;

export const colorSwatchPickerStyleNames = Object.keys(colorSwatchPickerMeta.styles) as ColorSwatchPickerStyle[];

export const defaultColorSwatchPickerStyle = colorSwatchPickerMeta.defaultStyle;
