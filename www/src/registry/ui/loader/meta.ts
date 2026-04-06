import type { RegistryItem } from "@/registry/types";

const loaderMeta = {
	name: "loader",
	type: "registry:ui",
	group: "feedback",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/loader/base.tsx",
			target: "ui/loader.tsx",
		},
	],
} satisfies RegistryItem;

export default loaderMeta;

export type LoaderStyle = keyof typeof loaderMeta.styles;

export const loaderStyleNames = Object.keys(loaderMeta.styles) as LoaderStyle[];

export const defaultLoaderStyle = loaderMeta.defaultStyle;
