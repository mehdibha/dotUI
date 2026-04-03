import type { RegistryItem } from "@dotui/registry/types";

const groupMeta = {
	name: "group",
	type: "registry:ui",
	group: "forms",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/group/base.tsx",
					target: "ui/group.tsx",
				},
			],
			registryDependencies: ["button"],
		},
	},
} satisfies RegistryItem;

export default groupMeta;

export const groupVariants = Object.keys(groupMeta.variants) as (keyof typeof groupMeta.variants)[];

export type GroupVariant = keyof typeof groupMeta.variants;

export const defaultGroupVariant = groupMeta.defaultVariant;
