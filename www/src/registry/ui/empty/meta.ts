import type { RegistryItem } from "@/registry/types";

const emptyMeta = {
	name: "empty",
	type: "registry:ui",
	group: "feedback",
	files: [
		{
			type: "registry:ui",
			path: "ui/empty/base.tsx",
			target: "ui/empty.tsx",
		},
	],
} satisfies RegistryItem;

export default emptyMeta;
