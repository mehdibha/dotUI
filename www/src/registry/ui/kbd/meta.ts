import type { RegistryItem } from "@/registry/types";

const kbdMeta = {
	name: "kbd",
	type: "registry:ui",
	group: "tags",
	files: [
		{
			type: "registry:ui",
			path: "ui/kbd/base.tsx",
			target: "ui/kbd.tsx",
		},
	],
} satisfies RegistryItem;

export default kbdMeta;
