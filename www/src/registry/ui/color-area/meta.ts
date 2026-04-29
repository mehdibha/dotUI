import type { RegistryItem } from "@/registry/types";

const colorAreaMeta = {
	name: "color-area",
	type: "registry:ui",
	group: "sliders",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	tokens: {
		"--color-area-radius": {
			type: "radius",
			default: "--radius-md",
		},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-area/base.tsx",
			target: "ui/color-area.tsx",
		},
	],
	registryDependencies: ["color-thumb"],
} satisfies RegistryItem;

export default colorAreaMeta;

export type ColorAreaStyle = keyof typeof colorAreaMeta.styles;

export const colorAreaStyleNames = Object.keys(colorAreaMeta.styles) as ColorAreaStyle[];

export const defaultColorAreaStyle = colorAreaMeta.defaultStyle;
