import type { RegistryItem } from "@/registry/types";

const colorThumbMeta = {
	name: "color-thumb",
	type: "registry:ui",
	group: "sliders",
	files: [
		{
			type: "registry:ui",
			path: "ui/color-thumb/base.tsx",
			target: "ui/color-thumb.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default colorThumbMeta;

