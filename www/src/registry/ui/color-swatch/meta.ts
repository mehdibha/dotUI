import type { RegistryItem } from "@/registry/types";

const colorSwatchMeta = {
	name: "color-swatch",
	type: "registry:ui",
	group: "color-swatches",
	files: [
		{
			type: "registry:ui",
			path: "ui/color-swatch/base.tsx",
			target: "ui/color-swatch.tsx",
		},
	],
	params: {
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--color-swatch-radius",
			default: "--radius-sm",
		},
	},
} satisfies RegistryItem;

export default colorSwatchMeta;

