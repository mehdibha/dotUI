import type { RegistryItem } from "@/registry/types";

const skeletonMeta = {
	name: "skeleton",
	type: "registry:ui",
	group: "progress",
	files: [
		{
			type: "registry:ui",
			path: "ui/skeleton/base.tsx",
			target: "ui/skeleton.tsx",
		},
	],
} satisfies RegistryItem;

export default skeletonMeta;

