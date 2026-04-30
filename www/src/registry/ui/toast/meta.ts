import type { RegistryItem } from "@/registry/types";

const toastMeta = {
	name: "toast",
	type: "registry:ui",
	group: "feedback",
	files: [
		{
			type: "registry:ui",
			path: "ui/toast/base.tsx",
			target: "ui/toast.tsx",
		},
	],
} satisfies RegistryItem;

export default toastMeta;

