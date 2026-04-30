import type { RegistryItem } from "@/registry/types";

const checkboxMeta = {
	name: "checkbox",
	type: "registry:ui",
	group: "selection-controls",
	files: [
		{
			type: "registry:ui",
			path: "ui/checkbox/base.tsx",
			target: "ui/checkbox.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
	params: {
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--checkbox-radius",
			default: "--radius-sm",
		},
	},
} satisfies RegistryItem;

export default checkboxMeta;

