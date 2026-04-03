import type { RegistryItem } from "@dotui/registry/types";

const datePickerMeta = {
	name: "date-picker",
	type: "registry:ui",
	group: "date-time",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/date-picker/base.tsx",
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
