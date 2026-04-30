import type { RegistryItem } from "@/registry/types";

const loaderMeta = {
	name: "loader",
	type: "registry:ui",
	group: "progress",
	files: [
		{
			type: "registry:ui",
			path: "ui/loader/base.tsx",
			target: "ui/loader.tsx",
		},
	],
} satisfies RegistryItem;

export default loaderMeta;

