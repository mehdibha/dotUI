import type { RegistryItem } from "@/registry/types";

const breadcrumbsMeta = {
	name: "breadcrumbs",
	type: "registry:ui",
	group: "navigation",
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
