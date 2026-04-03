import type { RegistryItem } from "@dotui/registry/types";

const colorAreaMeta = {
	name: "color-area",
	type: "registry:ui",
	group: "color",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/color-area/base.tsx",
					target: "ui/color-area.tsx",
				},
			],
			registryDependencies: ["color-thumb"],
		},
	},
} satisfies RegistryItem;

export default colorAreaMeta;
export const colorAreaVariants = Object.keys(colorAreaMeta.variants) as (keyof typeof colorAreaMeta.variants)[];

export type ColorAreaVariant = keyof typeof colorAreaMeta.variants;

export const defaultColorAreaVariant = colorAreaMeta.defaultVariant;
