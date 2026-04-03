import type { RegistryItem } from "@/registry/types";

const menuMeta = {
	name: "menu",
	type: "registry:ui",
	group: "overlays",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/menu/base.tsx",
					target: "ui/menu.tsx",
				},
			],
			registryDependencies: ["kbd", "overlay", "text"],
		},
	},
} satisfies RegistryItem;

export default menuMeta;
export const menuVariants = Object.keys(menuMeta.variants) as (keyof typeof menuMeta.variants)[];

export type MenuVariant = keyof typeof menuMeta.variants;

export const defaultMenuVariant = menuMeta.defaultVariant;
