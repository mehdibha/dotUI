import type { RegistryItem } from "@/registry/types";

const tooltipMeta = {
	name: "tooltip",
	type: "registry:ui",
	group: "overlays",
	files: [
		{
			type: "registry:ui",
			path: "ui/tooltip/base.tsx",
			target: "ui/tooltip.tsx",
		},
	],
} satisfies RegistryItem;

export default tooltipMeta;

