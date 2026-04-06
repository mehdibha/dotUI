import type { RegistryItem } from "@/registry/types";

const colorSliderMeta = {
	name: "color-slider",
	type: "registry:ui",
	group: "color",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-slider/base.tsx",
			target: "ui/color-slider.tsx",
		},
	],
	registryDependencies: ["field", "color-thumb"],
} satisfies RegistryItem;

export default colorSliderMeta;

export type ColorSliderStyle = keyof typeof colorSliderMeta.styles;

export const colorSliderStyleNames = Object.keys(colorSliderMeta.styles) as ColorSliderStyle[];

export const defaultColorSliderStyle = colorSliderMeta.defaultStyle;
