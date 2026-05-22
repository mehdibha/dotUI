import type { RegistryItem } from "@/registry/types";

const textMeta = {
	name: "text",
	type: "registry:ui",
	group: "typography",
	files: [
		{
			type: "registry:ui",
			path: "ui/text/base.tsx",
			target: "ui/text.tsx",
		},
	],
} satisfies RegistryItem;

export default textMeta;
