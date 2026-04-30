import type { RegistryItem } from "@/registry/types";

const commandMeta = {
	name: "command",
	type: "registry:ui",
	group: "menus-lists",
	files: [
		{
			type: "registry:ui",
			path: "ui/command/base.tsx",
			target: "ui/command.tsx",
		},
	],
} satisfies RegistryItem;

export default commandMeta;

