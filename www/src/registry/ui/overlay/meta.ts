import type { RegistryItem } from "@/registry/types";

const overlayMeta = {
	name: "overlay",
	type: "registry:ui",
	group: "overlays",
	files: [
		{
			type: "registry:ui",
			path: "ui/overlay/base.tsx",
			target: "ui/overlay.tsx",
		},
	],
	registryDependencies: ["modal", "popover", "drawer", "use-is-mobile"],
} satisfies RegistryItem;

export default overlayMeta;
