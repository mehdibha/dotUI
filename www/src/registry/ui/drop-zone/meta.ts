import type { RegistryItem } from "@/registry/types";

const dropZoneMeta = {
	name: "drop-zone",
	type: "registry:ui",
	group: "drop-zone",
	files: [
		{
			type: "registry:ui",
			path: "ui/drop-zone/base.tsx",
			target: "ui/drop-zone.tsx",
		},
	],
} satisfies RegistryItem;

export default dropZoneMeta;

