import type { RegistryItem } from "@/registry/types";

const colorPickerMeta = {
	name: "color-picker",
	type: "registry:ui",
	group: "pickers",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-picker/base.tsx",
			target: "ui/color-picker.tsx",
		},
	],
	registryDependencies: ["button", "color-area", "color-field", "color-slider", "color-swatch", "dialog", "select"],
} satisfies RegistryItem;

export default colorPickerMeta;

export type ColorPickerStyle = keyof typeof colorPickerMeta.styles;

export const colorPickerStyleNames = Object.keys(colorPickerMeta.styles) as ColorPickerStyle[];

export const defaultColorPickerStyle = colorPickerMeta.defaultStyle;
