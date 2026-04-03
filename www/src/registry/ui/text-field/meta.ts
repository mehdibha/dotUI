import type { RegistryItem } from "@/registry/types";

const textFieldMeta = {
	name: "text-field",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/text-field/base.tsx",
					target: "ui/text-field.tsx",
				},
			],
			registryDependencies: ["field", "input"],
		},
	},
} satisfies RegistryItem;

export default textFieldMeta;
export const textFieldVariants = Object.keys(textFieldMeta.variants) as (keyof typeof textFieldMeta.variants)[];

export type TextFieldVariant = keyof typeof textFieldMeta.variants;

export const defaultTextFieldVariant = textFieldMeta.defaultVariant;
