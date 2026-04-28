import type { RegistryItem } from "@/registry/types";

const listBoxMeta = {
	name: "list-box",
	type: "registry:ui",
	group: "menus-lists",
	files: [
		{
			type: "registry:ui",
			path: "ui/list-box/base.tsx",
			target: "ui/list-box.tsx",
		},
	],
	registryDependencies: ["text", "loader", "focus-styles"],
	dependencies: ["react-aria-components"],
} satisfies RegistryItem;

export default listBoxMeta;
