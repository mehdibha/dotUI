import type { RegistryItem } from "@/registry/types";

const radioGroupMeta = {
	name: "radio-group",
	type: "registry:ui",
	group: "selection-controls",
	files: [
		{
			type: "registry:ui",
			path: "ui/radio-group/base.tsx",
			target: "ui/radio-group.tsx",
		},
	],
	registryDependencies: ["focus-styles", "field"],
	params: {
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--radio-radius",
			default: "--radius-full",
		},
	},
} satisfies RegistryItem;

export default radioGroupMeta;
