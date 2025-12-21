import type { RegistryItem } from "@dotui/registry/types";

const calendarMeta = {
  name: "calendar",
  type: "registry:ui",
  group: "date-time",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/calendar/basic.tsx",
          target: "ui/calendar.tsx",
        },
      ],
      registryDependencies: ["button", "text", "focus-styles"],
    },
  },
} satisfies RegistryItem;

export default calendarMeta;
export const calendarVariants = Object.keys(
  calendarMeta.variants,
) as (keyof typeof calendarMeta.variants)[];

export type CalendarVariant = keyof typeof calendarMeta.variants;

export const defaultCalendarVariant = calendarMeta.defaultVariant;
