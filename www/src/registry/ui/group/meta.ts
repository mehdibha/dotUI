import type { RegistryItem } from "@/registry/types";

const groupMeta = {
	name: "group",
	type: "registry:ui",
	group: "containers",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/group/base.tsx",
			target: "ui/group.tsx",
		},
	],
	registryDependencies: ["button"],
} satisfies RegistryItem;

export default groupMeta;

export type GroupStyle = keyof typeof groupMeta.styles;

export const groupStyleNames = Object.keys(groupMeta.styles) as GroupStyle[];

export const defaultGroupStyle = groupMeta.defaultStyle;
