import type { RegistryItem } from "@/registry/types";

const breadcrumbsMeta = {
	name: "breadcrumbs",
	type: "registry:ui",
	group: "navigation",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/breadcrumbs/base.tsx",
					target: "ui/breadcrumbs.tsx",
				},
			],
			registryDependencies: ["focus-styles"],
		},
	},
} satisfies RegistryItem;

export default breadcrumbsMeta;
export const breadcrumbsVariants = Object.keys(breadcrumbsMeta.variants) as (keyof typeof breadcrumbsMeta.variants)[];

export type BreadcrumbsVariant = keyof typeof breadcrumbsMeta.variants;

export const defaultBreadcrumbsVariant = breadcrumbsMeta.defaultVariant;
