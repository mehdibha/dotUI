import type { RegistryItem } from "@/registry/types";

const skeletonMeta = {
	name: "skeleton",
	type: "registry:ui",
	group: "progress",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/skeleton/base.tsx",
			target: "ui/skeleton.tsx",
		},
	],
} satisfies RegistryItem;

export default skeletonMeta;

export type SkeletonStyle = keyof typeof skeletonMeta.styles;

export const skeletonStyleNames = Object.keys(skeletonMeta.styles) as SkeletonStyle[];

export const defaultSkeletonStyle = skeletonMeta.defaultStyle;
