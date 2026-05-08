import type { RegistryItem } from "@/registry/types";

const alertMeta = {
	name: "alert",
	type: "registry:ui",
	group: "feedback",
	files: [
		{
			type: "registry:ui",
			path: "ui/alert/base.tsx",
			target: "ui/alert.tsx",
		},
	],
	params: {
		style: {
			kind: "enum",
			default: "default",
			values: ["default", "sousse"] as const,
		},
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--alert-radius",
			default: "--radius-lg",
		},
	},
} satisfies RegistryItem;

export default alertMeta;
