import type { RegistryItem } from "@/registry/types";

const colorSwatchPickerMeta = {
	name: "color-swatch-picker",
	type: "registry:ui",
	group: "color-swatches",
	files: [
		{
			type: "registry:ui",
			path: "ui/color-swatch-picker/base.tsx",
			target: "ui/color-swatch-picker.tsx",
		},
	],
	registryDependencies: ["focus-styles", "color-swatch"],
	params: {
		itemRadius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--color-swatch-picker-item-radius",
			default: "--radius-md",
		},
	},
} satisfies RegistryItem;

export default colorSwatchPickerMeta;

