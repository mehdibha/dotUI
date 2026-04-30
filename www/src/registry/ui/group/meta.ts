import type { RegistryItem } from "@/registry/types";

const groupMeta = {
	name: "group",
	type: "registry:ui",
	group: "containers",
	files: [
		{
			type: "registry:ui",
			path: "ui/group/base.tsx",
			target: "ui/group.tsx",
		},
	],
	registryDependencies: ["button"],
} satisfies RegistryItem;

export default groupMeta;

