import type { RegistryItem } from "@dotui/registry/types";

const accordionMeta = {
	name: "accordion",
	type: "registry:ui",
	group: "data-display",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/accordion/base.tsx",
					target: "ui/accordion.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default accordionMeta;

export const accordionVariants = Object.keys(accordionMeta.variants) as (keyof typeof accordionMeta.variants)[];

export type AccordionVariant = keyof typeof accordionMeta.variants;

export const defaultAccordionVariant = accordionMeta.defaultVariant;
