import type { RegistryItem } from "@dotui/registry/types";

const emptyMeta = {
	name: "empty",
	type: "registry:ui",
	group: "feedback",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/empty/base.tsx",
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
