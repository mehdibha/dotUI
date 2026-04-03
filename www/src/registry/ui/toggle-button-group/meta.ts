import type { RegistryItem } from "@/registry/types";

const toggleButtonGroupMeta = {
	name: "toggle-button-group",
	type: "registry:ui",
	group: "buttons",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/toggle-button-group/base.tsx",
					target: "ui/toggle-button-group.tsx",
				},
			],
			registryDependencies: ["toggle-button"],
		},
	},
} satisfies RegistryItem;

export default toggleButtonGroupMeta;
export const toggleButtonGroupVariants = Object.keys(
	toggleButtonGroupMeta.variants,
) as (keyof typeof toggleButtonGroupMeta.variants)[];

export type ToggleButtonGroupVariant = keyof typeof toggleButtonGroupMeta.variants;

export const defaultToggleButtonGroupVariant = toggleButtonGroupMeta.defaultVariant;
