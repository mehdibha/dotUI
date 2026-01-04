import type { RegistryItem } from "@dotui/registry/types";

const listBoxMeta = {
	name: "list-box",
	type: "registry:ui",
	group: "selections",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/list-box/basic.tsx",
					target: "ui/list-box.tsx",
				},
			],
			registryDependencies: ["text", "focus-styles"],
		},
	},
} satisfies RegistryItem;

export default listBoxMeta;
export const listBoxVariants = Object.keys(listBoxMeta.variants) as (keyof typeof listBoxMeta.variants)[];

export type ListBoxVariant = keyof typeof listBoxMeta.variants;

export const defaultListBoxVariant = listBoxMeta.defaultVariant;
