import type { RegistryItem } from "@/registry/types";

const accordionMeta = {
	name: "accordion",
	type: "registry:ui",
	group: "disclosure",
	files: [
		{
			type: "registry:ui",
			path: "ui/accordion/base.tsx",
			target: "ui/accordion.tsx",
		},
	],
	params: {
		style: {
			kind: "enum",
			default: "default",
			values: ["default", "hammamet"] as const,
		},
	},
} satisfies RegistryItem;

export default accordionMeta;
