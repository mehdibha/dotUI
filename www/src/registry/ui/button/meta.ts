import type { RegistryItem } from "@/registry/types";

const buttonMeta = {
	name: "button",
	type: "registry:ui",
	group: "buttons",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/button/base.tsx",
					target: "ui/button.tsx",
				},
			],
			registryDependencies: ["loader", "focus-styles"],
		},
	},
} satisfies RegistryItem;

export default buttonMeta;

export const buttonVariants = Object.keys(buttonMeta.variants) as (keyof typeof buttonMeta.variants)[];

export type ButtonVariant = keyof typeof buttonMeta.variants;

export const defaultButtonVariant = buttonMeta.defaultVariant;
