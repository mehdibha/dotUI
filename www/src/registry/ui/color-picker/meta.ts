import type { RegistryItem } from "@/registry/types";

const colorPickerMeta = {
	name: "color-picker",
	type: "registry:ui",
	group: "color",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/color-picker/base.tsx",
					target: "ui/color-picker.tsx",
				},
			],
			registryDependencies: ["button", "color-area", "color-field", "color-slider", "color-swatch", "dialog", "select"],
		},
	},
} satisfies RegistryItem;

export default colorPickerMeta;
export const colorPickerVariants = Object.keys(colorPickerMeta.variants) as (keyof typeof colorPickerMeta.variants)[];

export type ColorPickerVariant = keyof typeof colorPickerMeta.variants;

export const defaultColorPickerVariant = colorPickerMeta.defaultVariant;
