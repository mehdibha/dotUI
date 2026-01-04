import type { RegistryItem } from "@dotui/registry/types";

const skeletonMeta = {
	name: "skeleton",
	type: "registry:ui",
	group: "feedback",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/skeleton/basic.tsx",
					target: "ui/skeleton.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default skeletonMeta;
export const skeletonVariants = Object.keys(skeletonMeta.variants) as (keyof typeof skeletonMeta.variants)[];

export type SkeletonVariant = keyof typeof skeletonMeta.variants;

export const defaultSkeletonVariant = skeletonMeta.defaultVariant;
