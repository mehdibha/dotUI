import type { RegistryItem } from "@/registry/types";

const switchMeta = {
	name: "switch",
	type: "registry:ui",
	group: "selection-controls",
	files: [
		{
			type: "registry:ui",
			path: "ui/switch/base.tsx",
			target: "ui/switch.tsx",
		},
	],
	registryDependencies: ["focus-styles", "field"],
	params: {
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--switch-radius",
			default: "--radius-full",
		},
		"card-radius": {
			kind: "scalar",
			type: "radius",
			cssVar: "--switch-card-radius",
			default: "--radius-lg",
			description: "Radius of the switch control when it contains label content.",
		},
	},
} satisfies RegistryItem;

export default switchMeta;
