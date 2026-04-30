import type { RegistryItem } from "@/registry/types";

const inputMeta = {
	name: "input",
	type: "registry:ui",
	group: "inputs",
	files: [
		{
			type: "registry:ui",
			path: "ui/input/base.tsx",
			target: "ui/input.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
	dependencies: ["react-aria", "react-stately"],
	params: {
		style: {
			kind: "enum",
			default: "outline",
			values: ["outline", "line", "filled-line-bottom", "filled"] as const,
		},
	},
} satisfies RegistryItem;

export default inputMeta;

