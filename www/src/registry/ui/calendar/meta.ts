import type { RegistryItem } from "@/registry/types";

const calendarMeta = {
	name: "calendar",
	type: "registry:ui",
	group: "date-time",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/calendar/base.tsx",
			target: "ui/calendar.tsx",
		},
	],
	registryDependencies: ["button", "text", "focus-styles"],
} satisfies RegistryItem;

export default calendarMeta;

export type CalendarStyle = keyof typeof calendarMeta.styles;

export const calendarStyleNames = Object.keys(calendarMeta.styles) as CalendarStyle[];

export const defaultCalendarStyle = calendarMeta.defaultStyle;
