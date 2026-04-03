import type { RegistryItem } from "@dotui/registry/types";

const dialogMeta = {
	name: "dialog",
	type: "registry:ui",
	group: "overlays",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/dialog/base.tsx",
					target: "ui/dialog.tsx",
				},
			],
			registryDependencies: ["overlay"],
		},
	},
} satisfies RegistryItem;

export default dialogMeta;
export const dialogVariants = Object.keys(dialogMeta.variants) as (keyof typeof dialogMeta.variants)[];

export type DialogVariant = keyof typeof dialogMeta.variants;

export const defaultDialogVariant = dialogMeta.defaultVariant;
