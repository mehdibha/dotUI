import type { RegistryItem } from "@dotui/registry/types";

const loaderMeta = {
	name: "loader",
	type: "registry:ui",
	group: "feedback",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/loader/basic.tsx",
					target: "ui/loader.tsx",
				},
			],
		},
		ring: {
			files: [
				{
					type: "registry:ui",
					path: "ui/loader/ring.tsx",
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
