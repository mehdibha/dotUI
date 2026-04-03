import type { RegistryItem } from "@dotui/registry/types";

const linkMeta = {
	name: "link",
	type: "registry:ui",
	group: "buttons",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/link/base.tsx",
					target: "ui/link.tsx",
				},
			],
			registryDependencies: ["focus-styles"],
		},
	},
} satisfies RegistryItem;

export default linkMeta;
export const linkVariants = Object.keys(linkMeta.variants) as (keyof typeof linkMeta.variants)[];

export type LinkVariant = keyof typeof linkMeta.variants;

export const defaultLinkVariant = linkMeta.defaultVariant;
