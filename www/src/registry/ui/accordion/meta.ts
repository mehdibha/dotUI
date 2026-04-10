import type { RegistryItem } from "@/registry/types";

const accordionMeta = {
	name: "accordion",
	type: "registry:ui",
	group: "data-display",
	defaultStyle: "default",
	styles: {
		default: {},
		hammamet: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/accordion/base.tsx",
			target: "ui/accordion.tsx",
		},
	],
} satisfies RegistryItem;

export default accordionMeta;

export type AccordionStyle = keyof typeof accordionMeta.styles;

export const accordionStyleNames = Object.keys(accordionMeta.styles) as AccordionStyle[];

export const defaultAccordionStyle = accordionMeta.defaultStyle;
