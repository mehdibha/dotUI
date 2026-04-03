import type { RegistryItem } from "@/registry/types";

const cardMeta = {
	name: "card",
	type: "registry:ui",
	group: "data-display",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/card/base.tsx",
					target: "ui/card.tsx",
				},
			],
			registryDependencies: ["button", "text", "focus-styles"],
		},
	},
} satisfies RegistryItem;

export default cardMeta;
export const cardVariants = Object.keys(cardMeta.variants) as (keyof typeof cardMeta.variants)[];

export type CardVariant = keyof typeof cardMeta.variants;

export const defaultCardVariant = cardMeta.defaultVariant;
