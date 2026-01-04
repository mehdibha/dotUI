import type { RegistryItem } from "@dotui/registry/types";

const datePickerMeta = {
	name: "date-picker",
	type: "registry:ui",
	group: "date-time",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/date-picker/basic.tsx",
					target: "ui/date-picker.tsx",
				},
			],
			registryDependencies: ["button", "calendar", "field", "input", "dialog"],
		},
	},
} satisfies RegistryItem;

export default datePickerMeta;
export const datePickerVariants = Object.keys(datePickerMeta.variants) as (keyof typeof datePickerMeta.variants)[];

export type DatePickerVariant = keyof typeof datePickerMeta.variants;

export const defaultDatePickerVariant = datePickerMeta.defaultVariant;
