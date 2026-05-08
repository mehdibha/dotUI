import type { RegistryItem } from "@/registry/types";

const tagGroupMeta = {
	name: "tag-group",
	type: "registry:ui",
	group: "tags",
	files: [
		{
			type: "registry:ui",
			path: "ui/tag-group/base.tsx",
			target: "ui/tag-group.tsx",
		},
	],
	registryDependencies: ["field", "button", "focus-styles"],
	dependencies: ["react-aria-components"],
	params: {
		tagRadius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--tag-radius",
			default: "--radius-md",
		},
	},
} satisfies RegistryItem;

export default tagGroupMeta;
