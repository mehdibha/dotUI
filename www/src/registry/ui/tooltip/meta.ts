import type { RegistryItem } from "@/registry/types";

const tooltipMeta = {
	name: "tooltip",
	type: "registry:ui",
	group: "overlays",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/tooltip/base.tsx",
					target: "ui/tooltip.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default tooltipMeta;
export const tooltipVariants = Object.keys(tooltipMeta.variants) as (keyof typeof tooltipMeta.variants)[];

export type TooltipVariant = keyof typeof tooltipMeta.variants;

export const defaultTooltipVariant = tooltipMeta.defaultVariant;
