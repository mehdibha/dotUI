import type { RegistryItem } from "@dotui/registry/types";

const emptyMeta = {
	name: "empty",
	type: "registry:ui",
	group: "feedback",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/empty/basic.tsx",
					target: "ui/empty.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default emptyMeta;

export const emptyVariants = Object.keys(emptyMeta.variants) as (keyof typeof emptyMeta.variants)[];

export type EmptyVariant = keyof typeof emptyMeta.variants;

export const defaultEmptyVariant = emptyMeta.defaultVariant;
