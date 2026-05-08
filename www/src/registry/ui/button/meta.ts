import type { RegistryItem } from "@/registry/types";

const buttonMeta = {
	name: "button",
	type: "registry:ui",
	group: "buttons",
	files: [
		{
			type: "registry:ui",
			path: "ui/button/base.tsx",
			target: "ui/button.tsx",
		},
	],
	registryDependencies: ["loader", "focus-styles"],
} satisfies RegistryItem;

export default buttonMeta;
