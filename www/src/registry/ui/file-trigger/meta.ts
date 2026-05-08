import type { RegistryItem } from "@/registry/types";

const fileTriggerMeta = {
	name: "file-trigger",
	type: "registry:ui",
	group: "buttons",
	files: [
		{
			type: "registry:ui",
			path: "ui/file-trigger/base.tsx",
			target: "ui/file-trigger.tsx",
		},
	],
} satisfies RegistryItem;

export default fileTriggerMeta;
