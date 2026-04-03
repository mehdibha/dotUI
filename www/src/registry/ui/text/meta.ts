import type { RegistryItem } from "@/registry/types";

const textMeta = {
	name: "text",
	type: "registry:ui",
	group: "data-display",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/text/base.tsx",
					target: "ui/text.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default textMeta;
export const textVariants = Object.keys(textMeta.variants) as (keyof typeof textMeta.variants)[];

export type TextVariant = keyof typeof textMeta.variants;

export const defaultTextVariant = textMeta.defaultVariant;
