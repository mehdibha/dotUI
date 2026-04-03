import type { RegistryItem } from "@/registry/types";

const calendarMeta = {
	name: "calendar",
	type: "registry:ui",
	group: "date-time",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/calendar/base.tsx",
					target: "ui/calendar.tsx",
				},
			],
			registryDependencies: ["button", "text", "focus-styles"],
		},
	},
} satisfies RegistryItem;

export default calendarMeta;
export const calendarVariants = Object.keys(calendarMeta.variants) as (keyof typeof calendarMeta.variants)[];

export type CalendarVariant = keyof typeof calendarMeta.variants;

export const defaultCalendarVariant = calendarMeta.defaultVariant;
