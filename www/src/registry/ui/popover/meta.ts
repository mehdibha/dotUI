import type { RegistryItem } from "@/registry/types";

const popoverMeta = {
	name: "popover",
	type: "registry:ui",
	group: "overlays",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/popover/base.tsx",
			target: "ui/popover.tsx",
		},
	],
} satisfies RegistryItem;

export default popoverMeta;

export type PopoverStyle = keyof typeof popoverMeta.styles;

export const popoverStyleNames = Object.keys(popoverMeta.styles) as PopoverStyle[];

export const defaultPopoverStyle = popoverMeta.defaultStyle;
