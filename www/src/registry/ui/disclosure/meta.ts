import type { RegistryItem } from "@/registry/types";

const disclosureMeta = {
	name: "disclosure",
	type: "registry:ui",
	group: "data-display",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/disclosure/base.tsx",
					target: "ui/disclosure.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default disclosureMeta;

export const disclosureVariants = Object.keys(disclosureMeta.variants) as (keyof typeof disclosureMeta.variants)[];

export type DisclosureVariant = keyof typeof disclosureMeta.variants;

export const defaultDisclosureVariant = disclosureMeta.defaultVariant;
