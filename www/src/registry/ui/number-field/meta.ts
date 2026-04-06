import type { RegistryItem } from "@/registry/types";

const numberFieldMeta = {
	name: "number-field",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/number-field/base.tsx",
			target: "ui/number-field.tsx",
		},
	],
	registryDependencies: ["input", "field", "use-is-mobile"],
} satisfies RegistryItem;

export default numberFieldMeta;

export type NumberFieldStyle = keyof typeof numberFieldMeta.styles;

export const numberFieldStyleNames = Object.keys(numberFieldMeta.styles) as NumberFieldStyle[];

export const defaultNumberFieldStyle = numberFieldMeta.defaultStyle;
