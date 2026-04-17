import type { RegistryItem } from "@/registry/types";

const tagGroupMeta = {
	name: "tag-group",
	type: "registry:ui",
	group: "tags",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/tag-group/base.tsx",
			target: "ui/tag-group.tsx",
		},
	],
	registryDependencies: ["field", "button", "focus-styles"],
} satisfies RegistryItem;

export default tagGroupMeta;

export type TagGroupStyle = keyof typeof tagGroupMeta.styles;

export const tagGroupStyleNames = Object.keys(tagGroupMeta.styles) as TagGroupStyle[];

export const defaultTagGroupStyle = tagGroupMeta.defaultStyle;
