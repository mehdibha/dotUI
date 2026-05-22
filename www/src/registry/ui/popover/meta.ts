import type { RegistryItem } from "@/registry/types";

const popoverMeta = {
	name: "popover",
	type: "registry:ui",
	group: "overlays",
	files: [
		{
			type: "registry:ui",
			path: "ui/popover/base.tsx",
			target: "ui/popover.tsx",
		},
	],
} satisfies RegistryItem;

export default popoverMeta;
