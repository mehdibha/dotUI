import type { RegistryItem } from "@/registry/types";

const cardMeta = {
	name: "card",
	type: "registry:ui",
	group: "data-display",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/card/base.tsx",
			target: "ui/card.tsx",
		},
	],
	registryDependencies: ["button", "text", "focus-styles"],
} satisfies RegistryItem;

export default cardMeta;

export type CardStyle = keyof typeof cardMeta.styles;

export const cardStyleNames = Object.keys(cardMeta.styles) as CardStyle[];

export const defaultCardStyle = cardMeta.defaultStyle;
