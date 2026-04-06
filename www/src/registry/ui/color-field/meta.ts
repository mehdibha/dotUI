import type { RegistryItem } from "@/registry/types";

const colorFieldMeta = {
	name: "color-field",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-field/base.tsx",
			target: "ui/color-field.tsx",
		},
	],
	registryDependencies: ["field", "input"],
} satisfies RegistryItem;

export default colorFieldMeta;

export type ColorFieldStyle = keyof typeof colorFieldMeta.styles;

export const colorFieldStyleNames = Object.keys(colorFieldMeta.styles) as ColorFieldStyle[];

export const defaultColorFieldStyle = colorFieldMeta.defaultStyle;
