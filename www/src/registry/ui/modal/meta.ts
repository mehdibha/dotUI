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
} satisfies RegistryItem;

export default modalMeta;

