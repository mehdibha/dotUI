import type { RegistryItem } from "@/registry/types";

const sliderMeta = {
	name: "slider",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/slider/base.tsx",
					target: "ui/slider.tsx",
				},
			],
			registryDependencies: ["field", "focus-styles"],
			dependencies: ["react-aria"],
		},
	},
} satisfies RegistryItem;

export default sliderMeta;
export const sliderVariants = Object.keys(sliderMeta.variants) as (keyof typeof sliderMeta.variants)[];

export type SliderVariant = keyof typeof sliderMeta.variants;

export const defaultSliderVariant = sliderMeta.defaultVariant;
