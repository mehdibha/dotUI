import type { RegistryItem } from "@/registry/types";

const avatarMeta = {
	name: "avatar",
	type: "registry:ui",
	group: "data-display",
	files: [
		{
			type: "registry:ui",
			path: "ui/avatar/base.tsx",
			target: "ui/avatar.tsx",
		},
	],
	params: {
		"--avatar-radius": {
			type: "radius",
			default: "--radius-full",
		},
	},
} satisfies RegistryItem;

export default avatarMeta;
