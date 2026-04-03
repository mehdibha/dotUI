import type { RegistryItem } from "@dotui/registry/types";

const kbdMeta = {
	name: "kbd",
	type: "registry:ui",
	group: "data-display",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/kbd/base.tsx",
					target: "ui/kbd.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default kbdMeta;
export const kbdVariants = Object.keys(kbdMeta.variants) as (keyof typeof kbdMeta.variants)[];

export type KbdVariant = keyof typeof kbdMeta.variants;

export const defaultKbdVariant = kbdMeta.defaultVariant;
