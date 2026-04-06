import type { RegistryItem } from "@/registry/types";

const tooltipMeta = {
	name: "tooltip",
	type: "registry:ui",
	group: "overlays",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/tooltip/base.tsx",
			target: "ui/tooltip.tsx",
		},
	],
} satisfies RegistryItem;

export default tooltipMeta;

export type TooltipStyle = keyof typeof tooltipMeta.styles;

export const tooltipStyleNames = Object.keys(tooltipMeta.styles) as TooltipStyle[];

export const defaultTooltipStyle = tooltipMeta.defaultStyle;
