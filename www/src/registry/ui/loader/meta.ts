import type { RegistryItem } from "@/registry/types";

const loaderMeta = {
	name: "loader",
	type: "registry:ui",
	group: "feedback",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/loader/base.tsx",
					target: "ui/loader.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default loaderMeta;
export const loaderVariants = Object.keys(loaderMeta.variants) as (keyof typeof loaderMeta.variants)[];

export type LoaderVariant = keyof typeof loaderMeta.variants;

export const defaultLoaderVariant = loaderMeta.defaultVariant;
