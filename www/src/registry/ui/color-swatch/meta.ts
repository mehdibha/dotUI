import type { RegistryItem } from "@/registry/types";

const colorSwatchMeta = {
	name: "color-swatch",
	type: "registry:ui",
	group: "color",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/color-swatch/base.tsx",
					target: "ui/color-swatch.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default colorSwatchMeta;
export const colorSwatchVariants = Object.keys(colorSwatchMeta.variants) as (keyof typeof colorSwatchMeta.variants)[];

export type ColorSwatchVariant = keyof typeof colorSwatchMeta.variants;

export const defaultColorSwatchVariant = colorSwatchMeta.defaultVariant;
