import type { RegistryItem } from "@/registry/types";

const textFieldMeta = {
	name: "text-field",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/text-field/base.tsx",
			target: "ui/text-field.tsx",
		},
	],
	registryDependencies: ["field", "input"],
} satisfies RegistryItem;

export default textFieldMeta;

export type TextFieldStyle = keyof typeof textFieldMeta.styles;

export const textFieldStyleNames = Object.keys(textFieldMeta.styles) as TextFieldStyle[];

export const defaultTextFieldStyle = textFieldMeta.defaultStyle;
