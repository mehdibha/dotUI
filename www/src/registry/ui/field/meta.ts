import type { RegistryItem } from "@/registry/types";

const fieldMeta = {
	name: "field",
	type: "registry:ui",
	group: "forms",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/field/base.tsx",
			target: "ui/field.tsx",
		},
	],
} satisfies RegistryItem;

export default fieldMeta;

export type FieldStyle = keyof typeof fieldMeta.styles;

export const fieldStyleNames = Object.keys(fieldMeta.styles) as FieldStyle[];

export const defaultFieldStyle = fieldMeta.defaultStyle;
