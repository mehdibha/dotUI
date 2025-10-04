import type { RegistryItem } from "@dotui/registry/types";

const calendarMeta = {
  name: "calendar",
  type: "registry:ui",
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
    cal: {
      files: [
        {
          type: "registry:ui",
          path: "ui/calendar/cal.tsx",
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
