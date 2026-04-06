import type { RegistryItem } from "@/registry/types";

const dateFieldMeta = {
	name: "date-field",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/date-field/base.tsx",
			target: "ui/date-field.tsx",
		},
	],
	registryDependencies: ["field", "input"],
} satisfies RegistryItem;

export default dateFieldMeta;

export type DateFieldStyle = keyof typeof dateFieldMeta.styles;

export const dateFieldStyleNames = Object.keys(dateFieldMeta.styles) as DateFieldStyle[];

export const defaultDateFieldStyle = dateFieldMeta.defaultStyle;
