import type { RegistryItem } from "@/registry/types";

const sliderMeta = {
	name: "slider",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/slider/base.tsx",
			target: "ui/slider.tsx",
		},
	],
	registryDependencies: ["field", "focus-styles"],
	dependencies: ["react-aria"],
} satisfies RegistryItem;

export default sliderMeta;

export type SliderStyle = keyof typeof sliderMeta.styles;

export const sliderStyleNames = Object.keys(sliderMeta.styles) as SliderStyle[];

export const defaultSliderStyle = sliderMeta.defaultStyle;
