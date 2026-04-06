import type { RegistryItem } from "@/registry/types";

const breadcrumbsMeta = {
	name: "breadcrumbs",
	type: "registry:ui",
	group: "navigation",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/breadcrumbs/base.tsx",
			target: "ui/breadcrumbs.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default breadcrumbsMeta;

export type BreadcrumbsStyle = keyof typeof breadcrumbsMeta.styles;

export const breadcrumbsStyleNames = Object.keys(breadcrumbsMeta.styles) as BreadcrumbsStyle[];

export const defaultBreadcrumbsStyle = breadcrumbsMeta.defaultStyle;
