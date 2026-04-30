import type { RegistryItem } from "@/registry/types";

const calendarMeta = {
	name: "calendar",
	type: "registry:ui",
	group: "calendar",
	files: [
		{
			type: "registry:ui",
			path: "ui/calendar/base.tsx",
			target: "ui/calendar.tsx",
		},
	],
	registryDependencies: ["button", "select", "text", "focus-styles"],
} satisfies RegistryItem;

export default calendarMeta;

