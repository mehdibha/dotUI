import type { RegistryItem } from "@dotui/registry/types";

const badgeMeta = {
	name: "badge",
	type: "registry:ui",
	group: "data-display",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/badge/basic.tsx",
					target: "ui/badge.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default badgeMeta;
export const badgeVariants = Object.keys(badgeMeta.variants) as (keyof typeof badgeMeta.variants)[];

export type BadgeVariant = keyof typeof badgeMeta.variants;

export const defaultBadgeVariant = badgeMeta.defaultVariant;
