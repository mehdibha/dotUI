import type { RegistryItem } from "@dotui/registry/types";

const colorSliderMeta = {
	name: "color-slider",
	type: "registry:ui",
	group: "color",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/color-slider/base.tsx",
					target: "ui/color-slider.tsx",
				},
			],
			registryDependencies: ["field", "color-thumb"],
		},
	},
} satisfies RegistryItem;

export default colorSliderMeta;
export const colorSliderVariants = Object.keys(colorSliderMeta.variants) as (keyof typeof colorSliderMeta.variants)[];

export type ColorSliderVariant = keyof typeof colorSliderMeta.variants;

export const defaultColorSliderVariant = colorSliderMeta.defaultVariant;
