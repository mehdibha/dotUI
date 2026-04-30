import type { RegistryItem } from "@/registry/types";

const formMeta = {
	name: "form",
	type: "registry:ui",
	files: [
		{
			type: "registry:ui",
			path: "ui/react-hook-form/base.tsx",
			target: "ui/react-hook-form.tsx",
		},
	],
} satisfies RegistryItem;

export default formMeta;

