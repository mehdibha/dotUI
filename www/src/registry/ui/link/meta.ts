import type { RegistryItem } from "@/registry/types";

const linkMeta = {
	name: "link",
	type: "registry:ui",
	group: "buttons",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/link/base.tsx",
			target: "ui/link.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default linkMeta;

export type LinkStyle = keyof typeof linkMeta.styles;

export const linkStyleNames = Object.keys(linkMeta.styles) as LinkStyle[];

export const defaultLinkStyle = linkMeta.defaultStyle;
