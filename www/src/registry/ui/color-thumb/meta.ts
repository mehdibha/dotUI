import type { RegistryItem } from "@/registry/types";

const colorThumbMeta = {
	name: "color-thumb",
	type: "registry:ui",
	group: "color",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-thumb/base.tsx",
			target: "ui/color-thumb.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default colorThumbMeta;

export type ColorThumbStyle = keyof typeof colorThumbMeta.styles;

export const colorThumbStyleNames = Object.keys(colorThumbMeta.styles) as ColorThumbStyle[];

export const defaultColorThumbStyle = colorThumbMeta.defaultStyle;
