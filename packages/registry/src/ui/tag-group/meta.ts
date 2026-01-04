import type { RegistryItem } from "@dotui/registry/types";

const tagGroupMeta = {
	name: "tag-group",
	type: "registry:ui",
	group: "selections",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/tag-group/basic.tsx",
					target: "ui/tag-group.tsx",
				},
			],
			registryDependencies: ["field", "button", "focus-styles"],
		},
	},
} satisfies RegistryItem;

export default tagGroupMeta;
export const tagGroupVariants = Object.keys(tagGroupMeta.variants) as (keyof typeof tagGroupMeta.variants)[];

export type TagGroupVariant = keyof typeof tagGroupMeta.variants;

export const defaultTagGroupVariant = tagGroupMeta.defaultVariant;
