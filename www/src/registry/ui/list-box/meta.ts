import type { RegistryItem } from "@/registry/types";

const listBoxMeta = {
	name: "list-box",
	type: "registry:ui",
	group: "selections",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/list-box/base.tsx",
			target: "ui/list-box.tsx",
		},
	],
	registryDependencies: ["text", "focus-styles"],
} satisfies RegistryItem;

export default listBoxMeta;

export type ListBoxStyle = keyof typeof listBoxMeta.styles;

export const listBoxStyleNames = Object.keys(listBoxMeta.styles) as ListBoxStyle[];

export const defaultListBoxStyle = listBoxMeta.defaultStyle;
