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
	params: {
		highlight: {
			type: "select",
			default: "subtle",
			values: ["subtle", "accent"],
			description: "How focused/active items are highlighted.",
		},
	},
} satisfies RegistryItem;

export default listBoxMeta;
