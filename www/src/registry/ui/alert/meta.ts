import type { RegistryItem } from "@/registry/types";

const alertMeta = {
	name: "alert",
	type: "registry:ui",
	group: "feedback",
	defaultVariant: "base",
	variants: {
		base: {
			description: "Minimal with a subtle border and muted background.",
			files: [
				{
					type: "registry:ui",
					path: "ui/alert/base.tsx",
					target: "ui/alert.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default alertMeta;

export const alertVariants = Object.keys(alertMeta.variants) as (keyof typeof alertMeta.variants)[];

export type AlertVariant = keyof typeof alertMeta.variants;

export const defaultAlertVariant = alertMeta.defaultVariant;
