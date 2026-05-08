import type { RegistryItem } from "@/registry/types";

const progressBarMeta = {
	name: "progress-bar",
	type: "registry:ui",
	group: "progress",
	files: [
		{
			type: "registry:ui",
			path: "ui/progress-bar/base.tsx",
			target: "ui/progress-bar.tsx",
		},
	],
	registryDependencies: ["field"],
} satisfies RegistryItem;

export default progressBarMeta;
