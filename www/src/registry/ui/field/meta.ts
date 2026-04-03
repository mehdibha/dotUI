import type { RegistryItem } from "@/registry/types";

const fieldMeta = {
	name: "field",
	type: "registry:ui",
	group: "forms",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/field/base.tsx",
					target: "ui/field.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default fieldMeta;
export const fieldVariants = Object.keys(fieldMeta.variants) as (keyof typeof fieldMeta.variants)[];

export type FieldVariant = keyof typeof fieldMeta.variants;

export const defaultFieldVariant = fieldMeta.defaultVariant;
