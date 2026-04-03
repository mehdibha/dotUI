import type { RegistryItem } from "@dotui/registry/types";

const toggleButtonMeta = {
	name: "toggle-button",
	type: "registry:ui",
	group: "buttons",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/toggle-button/base.tsx",
					target: "ui/toggle-button.tsx",
				},
			],
			registryDependencies: ["focus-styles"],
		},
	},
} satisfies RegistryItem;

export default toggleButtonMeta;
export const toggleButtonVariants = Object.keys(
	toggleButtonMeta.variants,
) as (keyof typeof toggleButtonMeta.variants)[];

export type ToggleButtonVariant = keyof typeof toggleButtonMeta.variants;

export const defaultToggleButtonVariant = toggleButtonMeta.defaultVariant;
