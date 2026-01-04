import type { RegistryItem } from "@dotui/registry/types";

const sliderMeta = {
	name: "slider",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/slider/basic.tsx",
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
