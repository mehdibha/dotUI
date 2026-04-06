import type { RegistryItem } from "@/registry/types";

const overlayMeta = {
	name: "overlay",
	type: "registry:ui",
	group: "overlays",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/overlay/base.tsx",
			target: "ui/overlay.tsx",
		},
	],
	registryDependencies: ["modal", "popover", "drawer", "use-is-mobile"],
} satisfies RegistryItem;

export default overlayMeta;

export type OverlayStyle = keyof typeof overlayMeta.styles;

export const overlayStyleNames = Object.keys(overlayMeta.styles) as OverlayStyle[];

export const defaultOverlayStyle = overlayMeta.defaultStyle;
