import type { RegistryItem } from "@/registry/types";

const comboboxMeta = {
	name: "combobox",
	type: "registry:ui",
	group: "pickers",
	files: [
		{
			type: "registry:ui",
			path: "ui/combobox/base.tsx",
			target: "ui/combobox.tsx",
		},
	],
	registryDependencies: ["field", "button", "input", "list-box", "overlay"],
} satisfies RegistryItem;

export default comboboxMeta;

