import type { RegistryItem } from "@dotui/registry/types";

const colorThumbMeta = {
	name: "color-thumb",
	type: "registry:ui",
	group: "color",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/color-thumb/base.tsx",
					target: "ui/color-thumb.tsx",
				},
			],
			registryDependencies: ["focus-styles"],
		},
	},
} satisfies RegistryItem;

export default colorThumbMeta;
export const colorThumbVariants = Object.keys(colorThumbMeta.variants) as (keyof typeof colorThumbMeta.variants)[];

export type ColorThumbVariant = keyof typeof colorThumbMeta.variants;

export const defaultColorThumbVariant = colorThumbMeta.defaultVariant;
