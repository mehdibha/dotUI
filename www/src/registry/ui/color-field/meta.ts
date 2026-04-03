import type { RegistryItem } from "@/registry/types";

const colorFieldMeta = {
	name: "color-field",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/color-field/base.tsx",
					target: "ui/color-field.tsx",
				},
			],
			registryDependencies: ["field", "input"],
		},
	},
} satisfies RegistryItem;

export default colorFieldMeta;
export const colorFieldVariants = Object.keys(colorFieldMeta.variants) as (keyof typeof colorFieldMeta.variants)[];

export type ColorFieldVariant = keyof typeof colorFieldMeta.variants;

export const defaultColorFieldVariant = colorFieldMeta.defaultVariant;
