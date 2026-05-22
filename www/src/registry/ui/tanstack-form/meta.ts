import type { RegistryItem } from "@/registry/types";

const formMeta = {
	name: "form",
	type: "registry:ui",
	files: [
		{
			type: "registry:ui",
			path: "ui/tanstack-form/base.tsx",
			target: "ui/tanstack-form.tsx",
		},
	],
} satisfies RegistryItem;

export default formMeta;
