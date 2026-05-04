import type { RegistryItem } from "@/registry/types";

const modalMeta = {
	name: "modal",
	type: "registry:ui",
	group: "overlays",
	files: [
		{
			type: "registry:ui",
			path: "ui/modal/base.tsx",
			target: "ui/modal.tsx",
		},
	],
	params: {
		style: {
			kind: "enum",
			default: "default",
			values: ["default", "muted-footer"] as const,
		},
		"backdrop-blur": {
			kind: "scalar",
			type: "blur",
			cssVar: "--modal-backdrop-blur",
			default: "0px",
			description: "Amount of blur applied behind the modal.",
		},
		"backdrop-opacity": {
			kind: "scalar",
			type: "opacity",
			cssVar: "--modal-backdrop-opacity",
			default: "40%",
			description: "Opacity of the black backdrop.",
		},
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--modal-radius",
			default: "--radius-lg",
		},
	},
} satisfies RegistryItem;

export default modalMeta;
