import type { RegistryItem } from "@/registry/types";

const dateFieldMeta = {
	name: "date-field",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/date-field/base.tsx",
					target: "ui/date-field.tsx",
				},
			],
			registryDependencies: ["field", "input"],
		},
	},
} satisfies RegistryItem;

export default dateFieldMeta;
export const dateFieldVariants = Object.keys(dateFieldMeta.variants) as (keyof typeof dateFieldMeta.variants)[];

export type DateFieldVariant = keyof typeof dateFieldMeta.variants;

export const defaultDateFieldVariant = dateFieldMeta.defaultVariant;
