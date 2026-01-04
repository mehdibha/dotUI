import type { RegistryItem } from "@dotui/registry/types";

const separatorMeta = {
	name: "separator",
	type: "registry:ui",
	group: "layout",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/separator/basic.tsx",
					target: "ui/separator.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default separatorMeta;
export const separatorVariants = Object.keys(separatorMeta.variants) as (keyof typeof separatorMeta.variants)[];

export type SeparatorVariant = keyof typeof separatorMeta.variants;

export const defaultSeparatorVariant = separatorMeta.defaultVariant;
