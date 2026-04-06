import type { RegistryItem } from "@/registry/types";

const datePickerMeta = {
	name: "date-picker",
	type: "registry:ui",
	group: "date-time",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/date-picker/base.tsx",
			target: "ui/date-picker.tsx",
		},
	],
	registryDependencies: ["button", "calendar", "field", "input", "dialog"],
} satisfies RegistryItem;

export default datePickerMeta;

export type DatePickerStyle = keyof typeof datePickerMeta.styles;

export const datePickerStyleNames = Object.keys(datePickerMeta.styles) as DatePickerStyle[];

export const defaultDatePickerStyle = datePickerMeta.defaultStyle;
