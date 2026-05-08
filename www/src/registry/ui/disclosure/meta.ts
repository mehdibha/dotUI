import type { RegistryItem } from "@/registry/types";

const disclosureMeta = {
	name: "disclosure",
	type: "registry:ui",
	group: "disclosure",
	files: [
		{
			type: "registry:ui",
			path: "ui/disclosure/base.tsx",
			target: "ui/disclosure.tsx",
		},
	],
} satisfies RegistryItem;

export default disclosureMeta;
